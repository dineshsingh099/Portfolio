from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment: str 
    mongo_uri: str 
    mongo_db_name: str 
    jwt_secret: str 
    jwt_algorithm: str 
    access_token_expire_minutes: int 
    refresh_token_expire_days: int 
    admin_email: str 
    admin_default_password: str 
    contact_receiver_email: str 
    brevo_api_key: str = ""
    brevo_sender_email: str = ""
    brevo_sender_name: str 
    otp_expire_minutes: int 
    otp_max_attempts: int 
    frontend_origin: str 
    analytics_salt: str 

    class Config:
        env_file = ".env"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


settings = Settings()

if settings.is_production:
    if settings.jwt_secret in ("dev_secret", "", "change_this_to_a_long_random_string"):
        raise RuntimeError("JWT_SECRET must be set to a strong random value in production")
    if not settings.brevo_api_key:
        raise RuntimeError("BREVO_API_KEY must be set in production")
    if not settings.brevo_sender_email:
        raise RuntimeError("BREVO_SENDER_EMAIL must be set in production")
    if settings.analytics_salt == "change_this_salt":
        raise RuntimeError("ANALYTICS_SALT must be set to a random value in production")
