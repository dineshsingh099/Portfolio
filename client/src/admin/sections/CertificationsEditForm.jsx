import { useState } from "react";
import Modal from "../Modal";
import { Field, TextAreaField } from "../FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function CertificationsEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [list, setList] = useState(structuredClone(content.certifications));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (i, key, val) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: val };
    setList(next);
  };

  const addCert = () =>
    setList([...list, { id: uid(), icon: "fa-solid fa-certificate", title: "", description: "", issuer: "", fileUrl: "" }]);

  const removeCert = (i) => setList(list.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("certifications", list);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Certifications Section" onClose={onClose} wide>
      {error && <div className="form-error">{error}</div>}

      {list.map((cert, i) => (
        <div key={cert.id} className="array-block">
          <button type="button" className="array-block-remove" onClick={() => removeCert(i)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="form-row-2">
            <Field label="Icon (FontAwesome class)" value={cert.icon} onChange={(v) => update(i, "icon", v)} />
            <Field label="Issuer" value={cert.issuer} onChange={(v) => update(i, "issuer", v)} />
          </div>
          <Field label="Title" value={cert.title} onChange={(v) => update(i, "title", v)} />
          <TextAreaField label="Description" value={cert.description} onChange={(v) => update(i, "description", v)} rows={3} />
          <Field label="Certificate File URL" value={cert.fileUrl} onChange={(v) => update(i, "fileUrl", v)} />
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addCert}>
        <i className="fa-solid fa-plus"></i> Add Certification
      </button>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
