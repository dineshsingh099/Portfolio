from fastapi import APIRouter, Depends

from app.db.connection import profile_collection
from app.services.auth import get_current_admin
from app.models.models import AdminProfileIn
from app.services.activity import log_activity

router = APIRouter(prefix="/api/profile", tags=["profile"])

DOC_ID = "admin_profile"


@router.get("")
async def get_profile():
    doc = await profile_collection.find_one({"_id": DOC_ID})
    return {"avatar": doc.get("avatar", "") if doc else ""}


@router.put("", dependencies=[Depends(get_current_admin)])
async def update_profile(payload: AdminProfileIn):
    await profile_collection.update_one({"_id": DOC_ID}, {"$set": {"avatar": payload.avatar}}, upsert=True)
    await log_activity("profile", "Admin profile photo updated")
    return {"avatar": payload.avatar}
