from fastapi import APIRouter, Depends

from app.db.connection import content_collection
from app.services.auth import get_current_admin
from app.services.activity import log_activity
from app.models.models import (
    PortfolioContent,
    HeroContent,
    AboutContent,
    SkillCategory,
    TimelineItem,
    ProjectItem,
    CertificationItem,
    TestimonialItem,
    ResumeContent,
    ContactContent,
    SEOContent,
)
from app.db.seed_data import default_content

router = APIRouter(prefix="/api/content", tags=["content"])

DOC_ID = "portfolio_content"


async def get_content_doc() -> dict:
    doc = await content_collection.find_one({"_id": DOC_ID})
    if not doc:
        seed = default_content()
        seed["_id"] = DOC_ID
        await content_collection.insert_one(seed)
        return seed
    # backfill any keys added to the schema after the doc was first created
    seed = default_content()
    changed = False
    for key, value in seed.items():
        if key not in doc:
            doc[key] = value
            changed = True
    if changed:
        await content_collection.update_one({"_id": DOC_ID}, {"$set": {k: v for k, v in doc.items() if k != "_id"}})
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
    await log_activity("hero", "Hero section updated")
    return {"message": "Hero section updated"}


@router.put("/about", dependencies=[Depends(get_current_admin)])
async def update_about(payload: AboutContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"about": payload.model_dump()}}, upsert=True)
    await log_activity("about", "About section updated")
    return {"message": "About section updated"}


@router.put("/skills", dependencies=[Depends(get_current_admin)])
async def update_skills(payload: list[SkillCategory]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"skills": data}}, upsert=True)
    await log_activity("skills", "Skills section updated")
    return {"message": "Skills section updated"}


@router.put("/experience", dependencies=[Depends(get_current_admin)])
async def update_experience(payload: list[TimelineItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"experience": data}}, upsert=True)
    await log_activity("experience", "Experience section updated")
    return {"message": "Experience section updated"}


@router.put("/education", dependencies=[Depends(get_current_admin)])
async def update_education(payload: list[TimelineItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"education": data}}, upsert=True)
    await log_activity("education", "Education section updated")
    return {"message": "Education section updated"}


@router.put("/projects", dependencies=[Depends(get_current_admin)])
async def update_projects(payload: list[ProjectItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"projects": data}}, upsert=True)
    await log_activity("projects", "Projects section updated")
    return {"message": "Projects section updated"}


@router.put("/certifications", dependencies=[Depends(get_current_admin)])
async def update_certifications(payload: list[CertificationItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"certifications": data}}, upsert=True)
    await log_activity("certifications", "Certificates section updated")
    return {"message": "Certifications section updated"}


@router.put("/testimonials", dependencies=[Depends(get_current_admin)])
async def update_testimonials(payload: list[TestimonialItem]):
    data = [item.model_dump() for item in payload]
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"testimonials": data}}, upsert=True)
    await log_activity("testimonials", "Testimonials updated")
    return {"message": "Testimonials updated"}


@router.put("/resume", dependencies=[Depends(get_current_admin)])
async def update_resume(payload: ResumeContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"resume": payload.model_dump()}}, upsert=True)
    await log_activity("resume", "Resume updated")
    return {"message": "Resume section updated"}


@router.put("/contact", dependencies=[Depends(get_current_admin)])
async def update_contact(payload: ContactContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"contact": payload.model_dump()}}, upsert=True)
    await log_activity("contact", "Contact info updated")
    return {"message": "Contact section updated"}


@router.put("/seo", dependencies=[Depends(get_current_admin)])
async def update_seo(payload: SEOContent):
    await content_collection.update_one({"_id": DOC_ID}, {"$set": {"seo": payload.model_dump()}}, upsert=True)
    await log_activity("seo", "SEO settings updated")
    return {"message": "SEO settings updated"}
