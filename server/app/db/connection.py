from motor.motor_asyncio import AsyncIOMotorClient
from app.core.settings import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.mongo_db_name]

content_collection = db["content"]
otp_collection = db["otps"]
admins_collection = db["admins"]
refresh_tokens_collection = db["refresh_tokens"]
page_views_collection = db["page_views"]
notifications_collection = db["notifications"]
messages_collection = db["messages"]
activity_logs_collection = db["activity_logs"]
resume_downloads_collection = db["resume_downloads"]
profile_collection = db["admin_profile"]
