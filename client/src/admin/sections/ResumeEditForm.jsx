import { useState } from "react";
import Modal from "../Modal";
import { Field, TextAreaField, StringListField } from "../FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

export default function ResumeEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [data, setData] = useState(structuredClone(content.resume));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("resume", data);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Resume Section" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row-2">
        <Field label="Name" value={data.name} onChange={(v) => set("name", v)} />
        <Field label="Role" value={data.role} onChange={(v) => set("role", v)} />
      </div>
      <TextAreaField label="Description" value={data.description} onChange={(v) => set("description", v)} />
      <StringListField label="Highlight Chips" items={data.chips} onChange={(v) => set("chips", v)} placeholder="e.g. 3 Projects" />
      <Field label="Resume File URL" value={data.fileUrl} onChange={(v) => set("fileUrl", v)} />
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
