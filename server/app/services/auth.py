import hashlib
import random
import secrets
import string
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError

from app.core.settings import settings
from app.db.connection import otp_collection, admins_collection, refresh_tokens_collection

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), password_hash.encode())
    except ValueError:
        return False


async def ensure_admin_account():
    existing = await admins_collection.find_one({"email": settings.admin_email})
    if not existing:
        await admins_collection.insert_one(
            {"email": settings.admin_email, "password_hash": hash_password(settings.admin_default_password)}
        )


async def get_admin_account():
    return await admins_collection.find_one({"email": settings.admin_email})


async def update_admin_password(new_password: str):
    await admins_collection.update_one(
        {"email": settings.admin_email},
        {"$set": {"password_hash": hash_password(new_password)}},
        upsert=True,
    )


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def _hash_code(code: str) -> str:
    return hashlib.sha256(code.encode()).hexdigest()


async def store_otp(email: str, code: str, purpose: str):
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes)
    await otp_collection.update_one(
        {"email": email, "purpose": purpose},
        {"$set": {"email": email, "purpose": purpose, "code_hash": _hash_code(code), "expires_at": expires_at, "attempts": 0}},
        upsert=True,
    )


async def verify_otp(email: str, code: str, purpose: str) -> bool:
    record = await otp_collection.find_one({"email": email, "purpose": purpose})
    if not record:
        return False

    expires_at = record["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        await otp_collection.delete_one({"_id": record["_id"]})
        return False

    if record.get("attempts", 0) >= settings.otp_max_attempts:
        await otp_collection.delete_one({"_id": record["_id"]})
        return False

    if record["code_hash"] != _hash_code(code):
        await otp_collection.update_one({"_id": record["_id"]}, {"$inc": {"attempts": 1}})
        return False

    await otp_collection.delete_one({"_id": record["_id"]})
    return True


def create_access_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": email, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


async def create_refresh_token(email: str) -> str:
    raw_token = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    await refresh_tokens_collection.insert_one(
        {"token_hash": _hash_token(raw_token), "email": email, "expires_at": expires_at, "revoked": False}
    )
    return raw_token


async def rotate_refresh_token(raw_token: str):
    record = await refresh_tokens_collection.find_one({"token_hash": _hash_token(raw_token)})
    if not record or record.get("revoked"):
        return None
    expires_at = record["expires_at"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if datetime.now(timezone.utc) > expires_at:
        return None

    await refresh_tokens_collection.update_one({"_id": record["_id"]}, {"$set": {"revoked": True}})
    new_refresh = await create_refresh_token(record["email"])
    new_access = create_access_token(record["email"])
    return {"access_token": new_access, "refresh_token": new_refresh}


async def revoke_refresh_token(raw_token: str):
    await refresh_tokens_collection.update_one(
        {"token_hash": _hash_token(raw_token)}, {"$set": {"revoked": True}}
    )


async def revoke_all_refresh_tokens(email: str):
    await refresh_tokens_collection.update_many({"email": email}, {"$set": {"revoked": True}})


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        token_type = payload.get("type")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    if token_type != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    if email != settings.admin_email:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return email
