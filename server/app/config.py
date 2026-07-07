from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

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
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_app_password: str
    otp_expire_minutes: int
    otp_max_attempts: int
    frontend_origin: str
    analytics_salt: str

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


settings = Settings()

if settings.is_production:
    if not settings.jwt_secret:
        raise RuntimeError("JWT_SECRET must be set")
    if not settings.smtp_app_password:
        raise RuntimeError("SMTP_APP_PASSWORD must be set")
    if not settings.analytics_salt:
        raise RuntimeError("ANALYTICS_SALT must be set")