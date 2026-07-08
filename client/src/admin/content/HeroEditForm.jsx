import { useState } from "react";
import Modal from "../shared/Modal";
import { Field, TextAreaField, StringListField } from "../shared/FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

export default function HeroEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [data, setData] = useState(structuredClone(content.hero));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));
  const setSocial = (key, val) => setData((d) => ({ ...d, socialLinks: { ...d.socialLinks, [key]: val } }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("hero", data);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Hero Section" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row-2">
        <Field label="First Name" value={data.firstName} onChange={(v) => set("firstName", v)} />
        <Field label="Last Name" value={data.lastName} onChange={(v) => set("lastName", v)} />
      </div>
      <Field label="Greeting" value={data.greeting} onChange={(v) => set("greeting", v)} />
      <TextAreaField label="Bio" value={data.bio} onChange={(v) => set("bio", v)} />
      <StringListField label="Rotating Roles" items={data.roles} onChange={(v) => set("roles", v)} placeholder="e.g. Data Analyst" />
      <StringListField label="Badges" items={data.badges} onChange={(v) => set("badges", v)} placeholder="e.g. React Dev" />
      <Field label="Resume File URL" value={data.resumeUrl} onChange={(v) => set("resumeUrl", v)} />
      <Field label="Profile Image URL" value={data.profileImage} onChange={(v) => set("profileImage", v)} />
      <div className="form-row-2">
        <Field label="GitHub" value={data.socialLinks.github} onChange={(v) => setSocial("github", v)} />
        <Field label="LinkedIn" value={data.socialLinks.linkedin} onChange={(v) => setSocial("linkedin", v)} />
      </div>
      <div className="form-row-2">
        <Field label="Instagram" value={data.socialLinks.instagram} onChange={(v) => setSocial("instagram", v)} />
        <Field label="Contact Email" value={data.socialLinks.email} onChange={(v) => setSocial("email", v)} />
      </div>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
