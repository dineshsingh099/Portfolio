import { useState } from "react";
import Modal from "../Modal";
import { Field, StringListField } from "../FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

export default function AboutEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [data, setData] = useState(structuredClone(content.about));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const updateStat = (i, key, val) => {
    const next = [...data.stats];
    next[i] = { ...next[i], [key]: val };
    set("stats", next);
  };
  const addStat = () => set("stats", [...data.stats, { icon: "fa-solid fa-star", value: "0", suffix: "", label: "" }]);
  const removeStat = (i) => set("stats", data.stats.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("about", data);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit About Section" onClose={onClose} wide>
      {error && <div className="form-error">{error}</div>}
      <div className="form-row-2">
        <Field label="Heading" value={data.heading} onChange={(v) => set("heading", v)} />
        <Field label="Highlight Word" value={data.highlight} onChange={(v) => set("highlight", v)} />
      </div>
      <StringListField label="Paragraphs" items={data.paragraphs} onChange={(v) => set("paragraphs", v)} placeholder="Write a paragraph about yourself" />
      <StringListField label="Tech Pills" items={data.techPills} onChange={(v) => set("techPills", v)} placeholder="e.g. Python" />

      <div className="form-group">
        <label>Stat Cards</label>
        {data.stats.map((stat, i) => (
          <div key={i} className="array-block">
            <button type="button" className="array-block-remove" onClick={() => removeStat(i)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="form-row-2">
              <Field label="Icon (FontAwesome class)" value={stat.icon} onChange={(v) => updateStat(i, "icon", v)} />
              <Field label="Value" value={stat.value} onChange={(v) => updateStat(i, "value", v)} />
            </div>
            <div className="form-row-2">
              <Field label="Suffix" value={stat.suffix} onChange={(v) => updateStat(i, "suffix", v)} />
              <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, "label", v)} />
            </div>
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addStat}>
          <i className="fa-solid fa-plus"></i> Add Stat Card
        </button>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
