import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import HeroEditForm from "../sections/HeroEditForm";
import AboutEditForm from "../sections/AboutEditForm";
import SkillsEditForm from "../sections/SkillsEditForm";
import TimelineEditForm from "../sections/TimelineEditForm";
import ProjectsEditForm from "../sections/ProjectsEditForm";
import CertificationsEditForm from "../sections/CertificationsEditForm";
import ResumeEditForm from "../sections/ResumeEditForm";
import ContactEditForm from "../sections/ContactEditForm";

const SECTION_META = {
  hero: { title: "Hero Section", Form: HeroEditForm },
  about: { title: "About Section", Form: AboutEditForm },
  skills: { title: "Skills Section", Form: SkillsEditForm },
  experience: { title: "Work Experience", Form: TimelineEditForm, formProps: { section: "experience", label: "Experience" } },
  education: { title: "Education", Form: TimelineEditForm, formProps: { section: "education", label: "Education" } },
  projects: { title: "Projects", Form: ProjectsEditForm },
  certifications: { title: "Certifications", Form: CertificationsEditForm },
  resume: { title: "Resume", Form: ResumeEditForm },
  contact: { title: "Contact Section", Form: ContactEditForm },
};

function Preview({ sectionKey, content }) {
  if (!content) return null;

  if (sectionKey === "hero") {
    return (
      <div className="dash-preview-row">
        <img src={content.hero.profileImage} alt="" className="dash-preview-avatar" />
        <div>
          <h4>
            {content.hero.firstName} {content.hero.lastName}
          </h4>
          <p>{content.hero.roles.join(" • ")}</p>
        </div>
      </div>
    );
  }
  if (sectionKey === "about") {
    return <p className="dash-preview-text">{content.about.paragraphs[0] || "No description yet."}</p>;
  }
  if (sectionKey === "skills") {
    return <p className="dash-preview-text">{content.skills.length} skill categories, {content.skills.reduce((n, c) => n + c.items.length, 0)} total skills.</p>;
  }
  if (sectionKey === "experience") {
    return <p className="dash-preview-text">{content.experience.length} experience entries.</p>;
  }
  if (sectionKey === "education") {
    return <p className="dash-preview-text">{content.education.length} education entries.</p>;
  }
  if (sectionKey === "projects") {
    return <p className="dash-preview-text">{content.projects.length} projects listed.</p>;
  }
  if (sectionKey === "certifications") {
    return <p className="dash-preview-text">{content.certifications.length} certifications listed.</p>;
  }
  if (sectionKey === "resume") {
    return <p className="dash-preview-text">{content.resume.name} — {content.resume.role}</p>;
  }
  if (sectionKey === "contact") {
    return <p className="dash-preview-text">{content.contact.email} • {content.contact.phone}</p>;
  }
  return null;
}

export default function SectionManager({ sectionKey }) {
  const { content } = usePortfolio();
  const [editing, setEditing] = useState(false);
  const meta = SECTION_META[sectionKey];
  const FormComponent = meta.Form;

  return (
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h3>{meta.title}</h3>
        <button className="btn-save" style={{ flex: "none", padding: "8px 20px" }} onClick={() => setEditing(true)}>
          <i className="fa-solid fa-pen"></i> Edit Section
        </button>
      </div>
      {content && <Preview sectionKey={sectionKey} content={content} />}
      {editing && <FormComponent onClose={() => setEditing(false)} {...(meta.formProps || {})} />}
    </div>
  );
}
