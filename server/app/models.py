from typing import List, Optional
from pydantic import BaseModel, Field


class SocialLinks(BaseModel):
    github: str = ""
    linkedin: str = ""
    instagram: str = ""
    email: str = ""


class HeroContent(BaseModel):
    greeting: str = "Hello, I'm"
    firstName: str = "Dinesh"
    lastName: str = "Singh"
    roles: List[str] = []
    bio: str = ""
    resumeUrl: str = "/assets/Resume.pdf"
    profileImage: str = "/assets/images/profile.png"
    badges: List[str] = []
    socialLinks: SocialLinks = SocialLinks()


class StatCard(BaseModel):
    icon: str = "fa-solid fa-star"
    value: str = "0"
    suffix: str = ""
    label: str = ""


class AboutContent(BaseModel):
    heading: str = "Building Digital"
    highlight: str = "Experiences"
    paragraphs: List[str] = []
    techPills: List[str] = []
    stats: List[StatCard] = []


class SkillItem(BaseModel):
    icon: str = "fa-solid fa-code"
    label: str = ""


class SkillCategory(BaseModel):
    id: str
    category: str = "frontend"
    title: str = ""
    icon: str = "fa-solid fa-laptop-code"
    items: List[SkillItem] = []


class TimelineItem(BaseModel):
    id: str
    badgeText: str = ""
    badgeIcon: str = "fa-solid fa-briefcase"
    date: str = ""
    title: str = ""
    organization: str = ""
    bullets: List[str] = []
    tags: List[str] = []


class TechTag(BaseModel):
    icon: str = "fa-solid fa-code"
    label: str = ""


class ProjectItem(BaseModel):
    id: str
    number: str = "01"
    title: str = ""
    description: str = ""
    image: str = ""
    techTags: List[TechTag] = []
    liveUrl: str = "#"
    githubUrl: str = "#"


class CertificationItem(BaseModel):
    id: str
    icon: str = "fa-solid fa-certificate"
    title: str = ""
    description: str = ""
    issuer: str = ""
    fileUrl: str = ""


class ContactContent(BaseModel):
    heading: str = "Let's Work Together"
    intro: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    socialLinks: SocialLinks = SocialLinks()


class ResumeContent(BaseModel):
    name: str = "Dinesh Singh"
    role: str = "Data Analyst & Web Developer"
    description: str = ""
    chips: List[str] = []
    fileUrl: str = "/assets/Resume.pdf"


class PortfolioContent(BaseModel):
    hero: HeroContent = HeroContent()
    about: AboutContent = AboutContent()
    skills: List[SkillCategory] = []
    experience: List[TimelineItem] = []
    education: List[TimelineItem] = []
    projects: List[ProjectItem] = []
    certifications: List[CertificationItem] = []
    resume: ResumeContent = ResumeContent()
    contact: ContactContent = ContactContent()


class OTPRequest(BaseModel):
    email: str


class OTPVerify(BaseModel):
    email: str
    code: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str = Field(..., min_length=1, max_length=200)


class RefreshRequest(BaseModel):
    refresh_token: str


class LogoutRequest(BaseModel):
    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str = Field(..., min_length=8, max_length=200)


class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., min_length=1, max_length=200)
    new_password: str = Field(..., min_length=8, max_length=200)


class PageViewIn(BaseModel):
    path: str = Field(..., max_length=300)


class NotificationOut(BaseModel):
    id: str
    type: str
    message: str
    created_at: str
    read: bool


class ContactFormPayload(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=254, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    subject: Optional[str] = Field("", max_length=150)
    message: str = Field(..., min_length=1, max_length=3000)
