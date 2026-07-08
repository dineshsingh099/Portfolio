import logging
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, Request
from fastapi.concurrency import run_in_threadpool

from app.models.models import ContactFormPayload
from app.utils.email_utils import send_contact_email
from app.core.limiter import limiter
from app.services.notifications import create_notification
from app.db.connection import messages_collection
from app.services.activity import log_activity
from app.services.tracking import parse_device, geo_lookup

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("")
@limiter.limit("5/minute")
async def submit_contact(request: Request, payload: ContactFormPayload):
    try:
        send_contact_email(payload.name, payload.email, payload.subject or "", payload.message)
    except Exception:
        logger.exception("Failed to send contact email via Brevo")
        raise HTTPException(status_code=500, detail="Failed to send message, please try again later")

    ip = request.client.host if request.client else "unknown"
    ua = request.headers.get("user-agent", "")
    country, country_code = await run_in_threadpool(geo_lookup, ip)

    await messages_collection.insert_one(
        {
            "name": payload.name,
            "email": payload.email,
            "subject": payload.subject or "",
            "message": payload.message,
            "read": False,
            "country": country,
            "country_code": country_code,
            "device": parse_device(ua),
            "created_at": datetime.now(timezone.utc),
        }
    )
    await create_notification("contact", f"New message from {payload.name} ({payload.email})")
    await log_activity("message", f"New message from {payload.name}")
    return {"message": "Message sent successfully"}
