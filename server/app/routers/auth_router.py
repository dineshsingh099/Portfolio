import logging

from fastapi import APIRouter, HTTPException, Request, Depends

from app.core.settings import settings
from app.models.models import (
    LoginRequest,
    OTPVerify,
    TokenResponse,
    AccessTokenResponse,
    RefreshRequest,
    LogoutRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)
from app.services.auth import (
    generate_otp,
    store_otp,
    verify_otp,
    create_access_token,
    create_refresh_token,
    rotate_refresh_token,
    revoke_refresh_token,
    revoke_all_refresh_tokens,
    get_admin_account,
    update_admin_password,
    verify_password,
    get_current_admin,
)
from app.utils.email_utils import send_otp_email  # still used by forgot-password OTP flow below
from app.core.limiter import limiter
from app.services.notifications import create_notification

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(request: Request, payload: LoginRequest):
    if payload.email.lower() != settings.admin_email.lower():
        raise HTTPException(status_code=401, detail="Invalid email or password")

    account = await get_admin_account()
    if not account or not verify_password(payload.password, account["password_hash"]):
        await create_notification("security", f"Failed admin login attempt from IP {request.client.host}")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(settings.admin_email)
    refresh_token = await create_refresh_token(settings.admin_email)
    await create_notification("login", "Admin logged in successfully")
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=AccessTokenResponse)
@limiter.limit("30/minute")
async def refresh(request: Request, payload: RefreshRequest):
    result = await rotate_refresh_token(payload.refresh_token)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    return AccessTokenResponse(access_token=result["access_token"])


@router.post("/refresh-full", response_model=TokenResponse)
@limiter.limit("30/minute")
async def refresh_full(request: Request, payload: RefreshRequest):
    result = await rotate_refresh_token(payload.refresh_token)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    return TokenResponse(access_token=result["access_token"], refresh_token=result["refresh_token"])


@router.post("/logout")
async def logout(payload: LogoutRequest):
    await revoke_refresh_token(payload.refresh_token)
    return {"message": "Logged out"}


@router.post("/forgot-password")
@limiter.limit("3/minute")
async def forgot_password(request: Request, payload: ForgotPasswordRequest):
    if payload.email.lower() != settings.admin_email.lower():
        return {"message": "If this email is registered, a reset code has been sent"}
    code = generate_otp()
    await store_otp(settings.admin_email, code, purpose="reset")
    try:
        send_otp_email(settings.admin_email, code)
    except Exception:
        logger.exception("Failed to send OTP email via Brevo")
        raise HTTPException(status_code=500, detail="Failed to send OTP email, check Brevo settings")
    return {"message": "If this email is registered, a reset code has been sent"}


@router.post("/reset-password")
@limiter.limit("5/minute")
async def reset_password(request: Request, payload: ResetPasswordRequest):
    if payload.email.lower() != settings.admin_email.lower():
        raise HTTPException(status_code=400, detail="Invalid request")
    ok = await verify_otp(settings.admin_email, payload.code, purpose="reset")
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid or expired reset code")
    await update_admin_password(payload.new_password)
    await revoke_all_refresh_tokens(settings.admin_email)
    await create_notification("security", "Admin password was reset")
    return {"message": "Password reset successfully, please log in again"}


@router.post("/change-password", dependencies=[Depends(get_current_admin)])
async def change_password(payload: ChangePasswordRequest):
    account = await get_admin_account()
    if not account or not verify_password(payload.old_password, account["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await update_admin_password(payload.new_password)
    await revoke_all_refresh_tokens(settings.admin_email)
    await create_notification("security", "Admin password was changed")
    return {"message": "Password changed, please log in again"}
