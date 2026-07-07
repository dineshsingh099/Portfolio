# Portfolio Backend (FastAPI + MongoDB)

## Setup

1. Create virtual environment and install dependencies:
```
python -m venv venv
venv\Scripts\activate   (Windows)
source venv/bin/activate (Mac/Linux)
pip install -r requirements.txt
```

2. Copy `.env.example` to `.env` and fill in real values:
```
cp .env.example .env
```

- `MONGO_URI`: your MongoDB connection string (local or Atlas)
- `ADMIN_EMAIL`: dinesh.rawat.cs@gmail.com (only this email can log in as admin)
- `CONTACT_RECEIVER_EMAIL`: dinesh.rawat.cs@gmail.com (contact form messages land here)
- `SMTP_USERNAME` / `SMTP_APP_PASSWORD`: Gmail address + a 16-character **App Password**
  (Google Account -> Security -> 2-Step Verification -> App Passwords)
- `JWT_SECRET`: any long random string

3. Run the server:
```
uvicorn app.main:app --reload --port 8000
```

API will be live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Endpoints

- `GET  /api/content` — public, returns full portfolio content
- `PUT  /api/content/{section}` — admin only (Bearer token), sections: hero, about, skills, experience, education, projects, certifications, resume, contact
- `POST /api/auth/request-otp` — sends 6-digit OTP to admin email
- `POST /api/auth/verify-otp` — verifies OTP, returns JWT access token
- `POST /api/contact` — public, sends the contact form as an email
