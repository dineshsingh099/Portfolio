from fastapi import APIRouter, Depends

from app.database import content_collection
from app.auth import get_current_admin
from app.models import (
    PortfolioContent,
    HeroContent,
    AboutContent,
    SkillCategory,
    TimelineItem,
    ProjectItem,
    CertificationItem,
    ResumeContent,
    ContactContent,
)
from app.seed_data import default_content

router = APIRouter(prefix="/api/content", tags=["content"])

DOC_ID = "portfolio_content"


async def get_content_doc() -> dict:
    doc = await content_collection.find_one({"_id": DOC_ID})
    if not doc:
        seed = default_content()
        seed["_id"] = DOC_ID
        await content_collection.insert_one(seed)
        return seed
    return doc


def strip_id(doc: dict) -> dict:
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


@router.get("", response_model=PortfolioContent)
async def get_content():
    doc = await get_content_doc()
    return PortfolioContent(**strip_id(doc))


@router.put("/hero", dependencies=[Depends(get_current_admin)])
async def update_hero(payload: HeroContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"hero": payload.model_dump()}}, upsert=True)
    return {"message": "Hero section updated"}


@router.put("/about", dependencies=[Depends(get_current_admin)])
async def update_about(payload: AboutContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"about": payload.model_dump()}}, upsert=True)
    return {"message": "About section updated"}


@router.put("/skills", dependencies=[Depends(get_current_admin)])
async def update_skills(payload: list[SkillCategory]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"skills": data}}, upsert=True)
    return {"message": "Skills section updated"}


@router.put("/experience", dependencies=[Depends(get_current_admin)])
async def update_experience(payload: list[TimelineItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"experience": data}}, upsert=True)
    return {"message": "Experience section updated"}


@router.put("/education", dependencies=[Depends(get_current_admin)])
async def update_education(payload: list[TimelineItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"education": data}}, upsert=True)
    return {"message": "Education section updated"}


@router.put("/projects", dependencies=[Depends(get_current_admin)])
async def update_projects(payload: list[ProjectItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"projects": data}}, upsert=True)
    return {"message": "Projects section updated"}


@router.put("/certifications", dependencies=[Depends(get_current_admin)])
async def update_certifications(payload: list[CertificationItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"certifications": data}}, upsert=True)
    return {"message": "Certifications section updated"}


@router.put("/resume", dependencies=[Depends(get_current_admin)])
async def update_resume(payload: ResumeContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"resume": payload.model_dump()}}, upsert=True)
    return {"message": "Resume section updated"}


@router.put("/contact", dependencies=[Depends(get_current_admin)])
async def update_contact(payload: ContactContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"contact": payload.model_dump()}}, upsert=True)
    return {"message": "Contact section updated"}
