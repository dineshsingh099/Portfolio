from bson import ObjectId
from fastapi import APIRouter, Depends

from app.database import notifications_collection
from app.auth import get_current_admin

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


def serialize(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "type": doc["type"],
        "message": doc["message"],
        "created_at": doc["created_at"].isoformat(),
        "read": doc.get("read", False),
    }


@router.get("", dependencies=[Depends(get_current_admin)])
async def list_notifications():
    cursor = notifications_collection.find().sort("created_at", -1).limit(50)
    docs = [serialize(doc) async for doc in cursor]
    unread_count = await notifications_collection.count_documents({"read": False})
    return {"notifications": docs, "unread_count": unread_count}


@router.put("/{notif_id}/read", dependencies=[Depends(get_current_admin)])
async def mark_read(notif_id: str):
    await notifications_collection.update_one({"_id": ObjectId(notif_id)}, {"$set": {"read": True}})
    return {"message": "Marked as read"}


@router.put("/read-all", dependencies=[Depends(get_current_admin)])
async def mark_all_read():
    await notifications_collection.update_many({"read": False}, {"$set": {"read": True}})
    return {"message": "All notifications marked as read"}
