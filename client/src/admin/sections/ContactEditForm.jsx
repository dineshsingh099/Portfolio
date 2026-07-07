import { useState } from "react";
import Modal from "../Modal";
import { Field, TextAreaField } from "../FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

export default function ContactEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [data, setData] = useState(structuredClone(content.contact));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));
  const setSocial = (key, val) => setData((d) => ({ ...d, socialLinks: { ...d.socialLinks, [key]: val } }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("contact", data);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Contact Section" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <Field label="Heading" value={data.heading} onChange={(v) => set("heading", v)} />
      <TextAreaField label="Intro Text" value={data.intro} onChange={(v) => set("intro", v)} rows={3} />
      <div className="form-row-2">
        <Field label="Display Email" value={data.email} onChange={(v) => set("email", v)} />
        <Field label="Phone" value={data.phone} onChange={(v) => set("phone", v)} />
      </div>
      <Field label="Location" value={data.location} onChange={(v) => set("location", v)} />
      <div className="form-row-2">
        <Field label="GitHub" value={data.socialLinks.github} onChange={(v) => setSocial("github", v)} />
        <Field label="LinkedIn" value={data.socialLinks.linkedin} onChange={(v) => setSocial("linkedin", v)} />
      </div>
      <Field label="Instagram" value={data.socialLinks.instagram} onChange={(v) => setSocial("instagram", v)} />
      <p className="form-hint">Note: Messages sent through the contact form are always emailed to the site owner's inbox, regardless of the display email above.</p>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
