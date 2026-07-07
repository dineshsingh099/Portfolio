import requests
from app.config import settings

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _send(to_email: str, subject: str, html_body: str, reply_to: str | None = None):
    """
    Sends email via Brevo's HTTPS API instead of raw SMTP.
    Render (and many free-tier hosts) block outbound SMTP ports (25/465/587),
    which causes "Network is unreachable" errors. Brevo's API works over
    HTTPS (port 443), which is never blocked.
    """
    payload = {
        "sender": {"name": settings.brevo_sender_name, "email": settings.brevo_sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_body,
    }
    if reply_to:
        payload["replyTo"] = {"email": reply_to}

    headers = {
        "accept": "application/json",
        "api-key": settings.brevo_api_key,
        "content-type": "application/json",
    }

    response = requests.post(BREVO_API_URL, json=payload, headers=headers, timeout=10)
    if response.status_code >= 300:
        raise RuntimeError(f"Brevo email send failed ({response.status_code}): {response.text}")


def send_otp_email(to_email: str, code: str):
    subject = "Your Admin Login OTP - Portfolio Dashboard"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
      <div style="background:#0f172a;padding:24px;text-align:center">
        <h2 style="color:#00f7ff;margin:0">Portfolio Admin</h2>
      </div>
      <div style="padding:28px;color:#1e293b">
        <p>Your one-time verification code is:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:6px;color:#0f172a;margin:16px 0">{code}</p>
        <p style="color:#64748b;font-size:14px">This code expires in {settings.otp_expire_minutes} minutes. If you did not request this, ignore this email.</p>
      </div>
    </div>
    """
    _send(to_email, subject, html)


def send_contact_email(name: str, email: str, subject_line: str, message: str):
    subject = f"New Portfolio Contact: {subject_line or 'General Inquiry'}"
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
      <div style="background:#0f172a;padding:24px">
        <h2 style="color:#00f7ff;margin:0">New Message From Portfolio</h2>
      </div>
      <div style="padding:28px;color:#1e293b;line-height:1.6">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Subject:</strong> {subject_line or '-'}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
        <p style="white-space:pre-wrap">{message}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">
        <p style="color:#64748b;font-size:13px">Reply directly to this email to respond to {name}.</p>
      </div>
    </div>
    """
    _send(settings.contact_receiver_email, subject, html, reply_to=email)
