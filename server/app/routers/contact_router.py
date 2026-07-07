from fastapi import APIRouter, HTTPException, Request

from app.models import ContactFormPayload
from app.email_utils import send_contact_email
from app.limiter import limiter
from app.notifications import create_notification

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("")
@limiter.limit("5/minute")
async def submit_contact(request: Request, payload: ContactFormPayload):
    try:
        send_contact_email(payload.name, payload.email, payload.subject or "", payload.message)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to send message, please try again later")
    await create_notification("contact", f"New message from {payload.name} ({payload.email})")
    return {"message": "Message sent successfully"}
