from fastapi import APIRouter, Depends

from app.db.connection import page_views_collection, resume_downloads_collection
from app.services.auth import get_current_admin
from app.services.activity import log_activity

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.post("/reset-analytics", dependencies=[Depends(get_current_admin)])
async def reset_analytics():
    """Wipes all visitor/page-view/resume-download tracking data so every
    dashboard graph (views, devices, countries, traffic sources, heatmap)
    starts fresh from zero. Portfolio content and contact messages are
    NOT touched."""
    pv_result = await page_views_collection.delete_many({})
    rd_result = await resume_downloads_collection.delete_many({})
    await log_activity("reset", "Website analytics data was reset to zero")
    return {
        "message": "Analytics data reset successfully",
        "page_views_deleted": pv_result.deleted_count,
        "resume_downloads_deleted": rd_result.deleted_count,
    }
