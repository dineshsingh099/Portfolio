import { useState } from "react";
import Modal from "../shared/Modal";
import { Field, StringListField } from "../shared/FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function TimelineEditForm({ section, label, onClose }) {
  const { content, saveSection } = usePortfolio();
  const [list, setList] = useState(structuredClone(content[section]));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (i, key, val) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: val };
    setList(next);
  };

  const addEntry = () =>
    setList([
      ...list,
      { id: uid(), badgeText: "", badgeIcon: "fa-solid fa-briefcase", date: "", title: "", organization: "", bullets: [], tags: [] },
    ]);

  const removeEntry = (i) => setList(list.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection(section, list);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={`Edit ${label}`} onClose={onClose} wide>
      {error && <div className="form-error">{error}</div>}

      {list.map((entry, i) => (
        <div key={entry.id} className="array-block">
          <button type="button" className="array-block-remove" onClick={() => removeEntry(i)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="form-row-2">
            <Field label="Badge Text" value={entry.badgeText} onChange={(v) => update(i, "badgeText", v)} />
            <Field label="Badge Icon" value={entry.badgeIcon} onChange={(v) => update(i, "badgeIcon", v)} />
          </div>
          <Field label="Date Range" value={entry.date} onChange={(v) => update(i, "date", v)} />
          <Field label="Title" value={entry.title} onChange={(v) => update(i, "title", v)} />
          <Field label="Organization" value={entry.organization} onChange={(v) => update(i, "organization", v)} />
          <StringListField label="Bullet Points" items={entry.bullets} onChange={(v) => update(i, "bullets", v)} placeholder="Describe an achievement" />
          <StringListField label="Tags" items={entry.tags} onChange={(v) => update(i, "tags", v)} placeholder="e.g. Python" />
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addEntry}>
        <i className="fa-solid fa-plus"></i> Add {label} Entry
      </button>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
