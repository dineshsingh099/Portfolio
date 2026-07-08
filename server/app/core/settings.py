import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    def __init__(self):
        self.environment = os.getenv("ENVIRONMENT")
        self.mongo_uri = os.getenv("MONGO_URI")
        self.mongo_db_name = os.getenv("MONGO_DB_NAME")

        self.jwt_secret = os.getenv("JWT_SECRET")
        self.jwt_algorithm = os.getenv("JWT_ALGORITHM")

        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
        )
        self.refresh_token_expire_days = int(
            os.getenv("REFRESH_TOKEN_EXPIRE_DAYS")
        )

        self.admin_email = os.getenv("ADMIN_EMAIL")
        self.admin_default_password = os.getenv("ADMIN_DEFAULT_PASSWORD")

        self.contact_receiver_email = os.getenv("CONTACT_RECEIVER_EMAIL")

        self.brevo_api_key = os.getenv("BREVO_API_KEY")
        self.brevo_sender_email = os.getenv("BREVO_SENDER_EMAIL")
        self.brevo_sender_name = os.getenv("BREVO_SENDER_NAME")

        self.otp_expire_minutes = int(os.getenv("OTP_EXPIRE_MINUTES"))
        self.otp_max_attempts = int(os.getenv("OTP_MAX_ATTEMPTS"))

        self.frontend_origin = os.getenv("FRONTEND_ORIGIN")
        self.analytics_salt = os.getenv("ANALYTICS_SALT")

    @property
    def is_production(self):
        return self.environment.lower() == "production"


settings = Settings()

if settings.is_production:
    if settings.jwt_secret in (
        "dev_secret",
        "",
        "change_this_to_a_long_random_string",
    ):
        raise RuntimeError(
            "JWT_SECRET must be set to a strong random value in production"
        )

    if not settings.brevo_api_key:
        raise RuntimeError("BREVO_API_KEY must be set in production")

    if not settings.brevo_sender_email:
        raise RuntimeError("BREVO_SENDER_EMAIL must be set in production")

    if settings.analytics_salt == "change_this_salt":
        raise RuntimeError(
            "ANALYTICS_SALT must be set to a random value in production"
        )