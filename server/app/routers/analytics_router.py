import hashlib
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Request

from app.config import settings
from app.database import page_views_collection
from app.models import PageViewIn
from app.auth import get_current_admin
from app.limiter import limiter

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


def _visitor_hash(request: Request) -> str:
    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "unknown")
    raw = f"{ip}:{ua}:{settings.analytics_salt}"
    return hashlib.sha256(raw.encode()).hexdigest()


@router.post("/track")
@limiter.limit("60/minute")
async def track_view(request: Request, payload: PageViewIn):
    await page_views_collection.insert_one(
        {
            "path": payload.path,
            "visitor_hash": _visitor_hash(request),
            "timestamp": datetime.now(timezone.utc),
        }
    )
    return {"message": "tracked"}


@router.get("/summary", dependencies=[Depends(get_current_admin)])
async def summary():
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
