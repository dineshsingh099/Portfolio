import { useState } from "react";
import Modal from "../shared/Modal";
import { Field, TextAreaField } from "../shared/FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function TestimonialsEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [list, setList] = useState(structuredClone(content.testimonials || []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (i, key, val) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: val };
    setList(next);
  };

  const addTestimonial = () =>
    setList([...list, { id: uid(), name: "", role: "", company: "", avatar: "", quote: "", rating: 5 }]);

  const removeTestimonial = (i) => setList(list.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("testimonials", list);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Testimonials" onClose={onClose} wide>
      {error && <div className="form-error">{error}</div>}

      {list.map((t, i) => (
        <div key={t.id} className="array-block">
          <button type="button" className="array-block-remove" onClick={() => removeTestimonial(i)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="form-row-2">
            <Field label="Name" value={t.name} onChange={(v) => update(i, "name", v)} />
            <Field label="Role" value={t.role} onChange={(v) => update(i, "role", v)} />
          </div>
          <div className="form-row-2">
            <Field label="Company" value={t.company} onChange={(v) => update(i, "company", v)} />
            <Field label="Avatar Image URL" value={t.avatar} onChange={(v) => update(i, "avatar", v)} />
          </div>
          <TextAreaField label="Quote" value={t.quote} onChange={(v) => update(i, "quote", v)} rows={3} />
          <Field label="Rating (1-5)" value={String(t.rating)} onChange={(v) => update(i, "rating", Math.max(1, Math.min(5, Number(v) || 5)))} />
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addTestimonial}>
        <i className="fa-solid fa-plus"></i> Add Testimonial
      </button>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
