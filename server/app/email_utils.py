import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


def _send(to_email: str, subject: str, html_body: str, reply_to: str | None = None):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_username
    msg["To"] = to_email
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        server.login(settings.smtp_username, settings.smtp_app_password)
        server.sendmail(settings.smtp_username, to_email, msg.as_string())


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
