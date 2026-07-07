from datetime import datetime, timezone

from app.database import notifications_collection


async def create_notification(notif_type: str, message: str):
    await notifications_collection.insert_one(
        {
            "type": notif_type,
            "message": message,
            "created_at": datetime.now(timezone.utc),
            "read": False,
        }
    )
