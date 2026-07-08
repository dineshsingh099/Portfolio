from datetime import datetime, timezone

from app.db.connection import activity_logs_collection


async def log_activity(action: str, message: str):
    await activity_logs_collection.insert_one(
        {
            "action": action,
            "message": message,
            "created_at": datetime.now(timezone.utc),
        }
    )
