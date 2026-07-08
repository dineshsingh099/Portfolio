import hashlib
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request
from fastapi.concurrency import run_in_threadpool

from app.core.settings import settings
from app.db.connection import (
    page_views_collection,
    messages_collection,
    activity_logs_collection,
    resume_downloads_collection,
    content_collection,
)
from app.models.models import PageViewIn
from app.services.auth import get_current_admin
from app.core.limiter import limiter
from app.services.tracking import parse_device, classify_source, geo_lookup

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

RANGE_DAYS = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}


def _visitor_hash(request: Request) -> str:
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    raw = f"{ip}:{ua}:{settings.analytics_salt}"
    return hashlib.sha256(raw.encode()).hexdigest()


@router.post("/track")
@limiter.limit("60/minute")
async def track_view(request: Request, payload: PageViewIn):
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "")
    referrer = request.headers.get("referer", "") or payload.referrer or ""
    country, country_code = await run_in_threadpool(geo_lookup, ip)

    await page_views_collection.insert_one(
        {
            "path": payload.path,
            "visitor_hash": _visitor_hash(request),
            "timestamp": datetime.now(timezone.utc),
            "device": parse_device(ua),
            "country": country,
            "country_code": country_code,
            "source": classify_source(referrer),
        }
    )
    return {"message": "tracked"}


@router.post("/resume-download")
@limiter.limit("20/minute")
async def track_resume_download(request: Request):
    await resume_downloads_collection.insert_one({"timestamp": datetime.now(timezone.utc)})
    return {"message": "tracked"}


def _pct_change(current: int, previous: int) -> float:
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)


@router.get("/summary", dependencies=[Depends(get_current_admin)])
async def summary():
    """Kept for backwards compatibility with the old simple overview panel."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    last_30_start = today_start - timedelta(days=29)

    total_views = await page_views_collection.count_documents({})
    today_views = await page_views_collection.count_documents({"timestamp": {"$gte": today_start}})
    unique_visitors = len(await page_views_collection.distinct("visitor_hash"))

    daily_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": last_30_start}}},
            {
                "$group": {
                    "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                    "views": {"$sum": 1},
                    "visitors": {"$addToSet": "$visitor_hash"},
                }
            },
            {"$sort": {"_id": 1}},
        ]
    )
    daily = [
        {"date": doc["_id"], "views": doc["views"], "unique": len(doc["visitors"])}
        async for doc in daily_cursor
    ]

    top_pages_cursor = page_views_collection.aggregate(
        [
            {"$group": {"_id": "$path", "views": {"$sum": 1}}},
            {"$sort": {"views": -1}},
            {"$limit": 5},
        ]
    )
    top_pages = [{"path": doc["_id"], "views": doc["views"]} async for doc in top_pages_cursor]

    return {
        "total_views": total_views,
        "today_views": today_views,
        "unique_visitors": unique_visitors,
        "daily": daily,
        "top_pages": top_pages,
    }


@router.get("/dashboard", dependencies=[Depends(get_current_admin)])
async def dashboard(range: str = "30d"):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    yesterday_start = today_start - timedelta(days=1)

    range_days = RANGE_DAYS.get(range, 30)
    period_start = now - timedelta(days=range_days)
    prev_start = period_start - timedelta(days=range_days)

    # ---- stat cards ----
    total_views = await page_views_collection.count_documents({})
    period_views = await page_views_collection.count_documents({"timestamp": {"$gte": period_start}})
    prev_period_views = await page_views_collection.count_documents(
        {"timestamp": {"$gte": prev_start, "$lt": period_start}}
    )

    today_views = await page_views_collection.count_documents({"timestamp": {"$gte": today_start}})
    yesterday_views = await page_views_collection.count_documents(
        {"timestamp": {"$gte": yesterday_start, "$lt": today_start}}
    )

    unique_visitors = len(await page_views_collection.distinct("visitor_hash", {"timestamp": {"$gte": period_start}}))
    prev_unique_visitors = len(
        await page_views_collection.distinct(
            "visitor_hash", {"timestamp": {"$gte": prev_start, "$lt": period_start}}
        )
    )

    messages_period = await messages_collection.count_documents({"created_at": {"$gte": period_start}})
    messages_prev = await messages_collection.count_documents(
        {"created_at": {"$gte": prev_start, "$lt": period_start}}
    )
    messages_total = await messages_collection.count_documents({})
    messages_unread = await messages_collection.count_documents({"read": False})

    downloads_period = await resume_downloads_collection.count_documents({"timestamp": {"$gte": period_start}})
    downloads_prev = await resume_downloads_collection.count_documents(
        {"timestamp": {"$gte": prev_start, "$lt": period_start}}
    )
    downloads_total = await resume_downloads_collection.count_documents({})

    content_doc = await content_collection.find_one({"_id": "portfolio_content"}) or {}
    projects_count = len(content_doc.get("projects", []))
    certificates_count = len(content_doc.get("certifications", []))

    stats = {
        "portfolio_views": {"value": total_views, "change": _pct_change(period_views, prev_period_views)},
        "unique_visitors": {"value": unique_visitors, "change": _pct_change(unique_visitors, prev_unique_visitors)},
        "visitors_today": {"value": today_views, "change": _pct_change(today_views, yesterday_views)},
        "messages": {"value": messages_total, "unread": messages_unread, "change": _pct_change(messages_period, messages_prev)},
        "resume_downloads": {"value": downloads_total, "change": _pct_change(downloads_period, downloads_prev)},
        "projects": {"value": projects_count},
        "certificates": {"value": certificates_count},
    }

    # ---- visitor overview chart ----
    if range == "1y":
        date_fmt = "%Y-%m"
    else:
        date_fmt = "%Y-%m-%d"

    daily_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": period_start}}},
            {
                "$group": {
                    "_id": {"$dateToString": {"format": date_fmt, "date": "$timestamp"}},
                    "views": {"$sum": 1},
                    "visitors": {"$addToSet": "$visitor_hash"},
                }
            },
            {"$sort": {"_id": 1}},
        ]
    )
    overview = [
        {"date": doc["_id"], "views": doc["views"], "unique": len(doc["visitors"])}
        async for doc in daily_cursor
    ]

    # ---- device breakdown ----
    device_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": period_start}}},
            {"$project": {"device": {"$ifNull": ["$device", "Unknown"]}}},
            {"$group": {"_id": "$device", "count": {"$sum": 1}}},
        ]
    )
    device_rows = [doc async for doc in device_cursor]
    device_total = sum(d["count"] for d in device_rows) or 1
    devices = [
        {"name": d["_id"] or "Unknown", "value": d["count"], "pct": round(d["count"] / device_total * 100, 1)}
        for d in device_rows
    ]

    # ---- top countries ----
    country_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": period_start}}},
            {
                "$project": {
                    "country": {"$ifNull": ["$country", "Unknown"]},
                    "country_code": {"$ifNull": ["$country_code", ""]},
                }
            },
            {"$group": {"_id": "$country", "count": {"$sum": 1}, "code": {"$first": "$country_code"}}},
            {"$sort": {"count": -1}},
        ]
    )
    country_rows = [doc async for doc in country_cursor]
    country_total = sum(c["count"] for c in country_rows) or 1
    top_countries = [
        {"country": c["_id"] or "Unknown", "code": c.get("code", ""), "pct": round(c["count"] / country_total * 100, 1)}
        for c in country_rows[:5]
    ]
    others_pct = round(100 - sum(c["pct"] for c in top_countries), 1)
    if len(country_rows) > 5 and others_pct > 0:
        top_countries.append({"country": "Others", "code": "", "pct": others_pct})

    # ---- traffic sources ----
    source_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": period_start}}},
            {"$project": {"source": {"$ifNull": ["$source", "Direct"]}}},
            {"$group": {"_id": "$source", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
        ]
    )
    source_rows = [doc async for doc in source_cursor]
    source_total = sum(s["count"] for s in source_rows) or 1
    traffic_sources = [
        {"source": s["_id"] or "Direct", "pct": round(s["count"] / source_total * 100, 1)} for s in source_rows
    ]

    # ---- top pages ----
    pages_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": period_start}}},
            {"$group": {"_id": "$path", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 6},
        ]
    )
    page_rows = [doc async for doc in pages_cursor]
    pages_total = sum(p["count"] for p in page_rows) or 1
    top_pages = [
        {"path": p["_id"] or "/", "pct": round(p["count"] / pages_total * 100, 1), "views": p["count"]}
        for p in page_rows
    ]

    # ---- heatmap: daily counts for last 14 weeks ----
    heatmap_start = today_start - timedelta(weeks=14)
    heatmap_cursor = page_views_collection.aggregate(
        [
            {"$match": {"timestamp": {"$gte": heatmap_start}}},
            {
                "$group": {
                    "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
                    "count": {"$sum": 1},
                }
            },
        ]
    )
    heatmap_map = {doc["_id"]: doc["count"] async for doc in heatmap_cursor}
    heatmap = [{"date": d, "count": c} for d, c in heatmap_map.items()]

    # ---- recent activity ----
    activity_cursor = activity_logs_collection.find().sort("created_at", -1).limit(6)
    recent_activity = [
        {"action": doc["action"], "message": doc["message"], "created_at": doc["created_at"].isoformat()}
        async for doc in activity_cursor
    ]

    # ---- latest messages ----
    messages_cursor = messages_collection.find().sort("created_at", -1).limit(3)
    latest_messages = [
        {
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "email": doc.get("email", ""),
            "subject": doc.get("subject", ""),
            "read": doc.get("read", False),
            "created_at": doc["created_at"].isoformat(),
        }
        async for doc in messages_cursor
    ]

    return {
        "stats": stats,
        "overview": overview,
        "devices": devices,
        "top_countries": top_countries,
        "traffic_sources": traffic_sources,
        "top_pages": top_pages,
        "heatmap": heatmap,
        "recent_activity": recent_activity,
        "latest_messages": latest_messages,
    }
