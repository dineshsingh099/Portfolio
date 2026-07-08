from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.db.connection import messages_collection
from app.services.auth import get_current_admin
from app.services.activity import log_activity

router = APIRouter(prefix="/api/messages", tags=["messages"])


def serialize(doc: dict) -> dict:
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "email": doc.get("email", ""),
        "subject": doc.get("subject", ""),
        "message": doc.get("message", ""),
        "read": doc.get("read", False),
        "country": doc.get("country", "Unknown"),
        "device": doc.get("device", "Unknown"),
        "created_at": doc["created_at"].isoformat(),
    }


@router.get("", dependencies=[Depends(get_current_admin)])
async def list_messages(status: str = "all", q: str = ""):
    query: dict = {}
    if status == "unread":
        query["read"] = False
    elif status == "read":
        query["read"] = True

    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}},
            {"subject": {"$regex": q, "$options": "i"}},
            {"message": {"$regex": q, "$options": "i"}},
        ]

    cursor = messages_collection.find(query).sort("created_at", -1)
    docs = [serialize(doc) async for doc in cursor]
    total = await messages_collection.count_documents({})
    unread = await messages_collection.count_documents({"read": False})
    return {"messages": docs, "total": total, "unread": unread}


@router.put("/{message_id}/read", dependencies=[Depends(get_current_admin)])
async def mark_read(message_id: str):
    await messages_collection.update_one({"_id": ObjectId(message_id)}, {"$set": {"read": True}})
    return {"message": "Marked as read"}


@router.put("/{message_id}/unread", dependencies=[Depends(get_current_admin)])
async def mark_unread(message_id: str):
    await messages_collection.update_one({"_id": ObjectId(message_id)}, {"$set": {"read": False}})
    return {"message": "Marked as unread"}


@router.delete("/{message_id}", dependencies=[Depends(get_current_admin)])
async def delete_message(message_id: str):
    result = await messages_collection.delete_one({"_id": ObjectId(message_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    await log_activity("message_deleted", "A contact message was deleted")
    return {"message": "Message deleted"}
