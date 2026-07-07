import { useState } from "react";
import Modal from "../Modal";
import { Field } from "../FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function SkillsEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [list, setList] = useState(structuredClone(content.skills));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateCat = (i, key, val) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: val };
    setList(next);
  };

  const addCategory = () =>
    setList([...list, { id: uid(), category: "frontend", title: "", icon: "fa-solid fa-code", items: [] }]);

  const removeCategory = (i) => setList(list.filter((_, idx) => idx !== i));

  const updateItem = (ci, ii, key, val) => {
    const next = [...list];
    const items = [...next[ci].items];
    items[ii] = { ...items[ii], [key]: val };
    next[ci] = { ...next[ci], items };
    setList(next);
  };

  const addItem = (ci) => {
    const next = [...list];
    next[ci] = { ...next[ci], items: [...next[ci].items, { icon: "fa-solid fa-code", label: "" }] };
    setList(next);
  };

  const removeItem = (ci, ii) => {
    const next = [...list];
    next[ci] = { ...next[ci], items: next[ci].items.filter((_, idx) => idx !== ii) };
    setList(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("skills", list);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Skills Section" onClose={onClose} wide>
      {error && <div className="form-error">{error}</div>}

      {list.map((cat, ci) => (
        <div key={cat.id} className="array-block">
          <button type="button" className="array-block-remove" onClick={() => removeCategory(ci)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="form-row-2">
            <Field label="Category Title" value={cat.title} onChange={(v) => updateCat(ci, "title", v)} />
            <Field label="Filter Key (frontend/backend/data/tools)" value={cat.category} onChange={(v) => updateCat(ci, "category", v)} />
          </div>
          <Field label="Card Icon (FontAwesome class)" value={cat.icon} onChange={(v) => updateCat(ci, "icon", v)} />

          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", margin: "10px 0 6px", textTransform: "uppercase" }}>
            Skill Items
          </label>
          {cat.items.map((item, ii) => (
            <div key={ii} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input placeholder="Icon class" value={item.icon} onChange={(e) => updateItem(ci, ii, "icon", e.target.value)} style={{ flex: 1 }} />
              <input placeholder="Label" value={item.label} onChange={(e) => updateItem(ci, ii, "label", e.target.value)} style={{ flex: 2 }} />
              <button type="button" className="array-block-remove" style={{ position: "static" }} onClick={() => removeItem(ci, ii)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={() => addItem(ci)}>
            <i className="fa-solid fa-plus"></i> Add Skill Item
          </button>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addCategory}>
        <i className="fa-solid fa-plus"></i> Add Skill Category
      </button>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
