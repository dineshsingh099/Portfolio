import { useState } from "react";
import Modal from "../shared/Modal";
import { Field, TextAreaField } from "../shared/FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function ProjectsEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [list, setList] = useState(structuredClone(content.projects));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (i, key, val) => {
    const next = [...list];
    next[i] = { ...next[i], [key]: val };
    setList(next);
  };

  const addProject = () =>
    setList([
      ...list,
      { id: uid(), number: String(list.length + 1).padStart(2, "0"), title: "", description: "", image: "", techTags: [], liveUrl: "#", githubUrl: "#" },
    ]);

  const removeProject = (i) => setList(list.filter((_, idx) => idx !== i));

  const updateTag = (pi, ti, key, val) => {
    const next = [...list];
    const tags = [...next[pi].techTags];
    tags[ti] = { ...tags[ti], [key]: val };
    next[pi] = { ...next[pi], techTags: tags };
    setList(next);
  };
  const addTag = (pi) => {
    const next = [...list];
    next[pi] = { ...next[pi], techTags: [...next[pi].techTags, { icon: "fa-solid fa-code", label: "" }] };
    setList(next);
  };
  const removeTag = (pi, ti) => {
    const next = [...list];
    next[pi] = { ...next[pi], techTags: next[pi].techTags.filter((_, idx) => idx !== ti) };
    setList(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("projects", list);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Projects Section" onClose={onClose} wide>
      {error && <div className="form-error">{error}</div>}

      {list.map((proj, i) => (
        <div key={proj.id} className="array-block">
          <button type="button" className="array-block-remove" onClick={() => removeProject(i)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="form-row-2">
            <Field label="Display Number" value={proj.number} onChange={(v) => update(i, "number", v)} />
            <Field label="Title" value={proj.title} onChange={(v) => update(i, "title", v)} />
          </div>
          <TextAreaField label="Description" value={proj.description} onChange={(v) => update(i, "description", v)} />
          <Field label="Image URL" value={proj.image} onChange={(v) => update(i, "image", v)} />
          <div className="form-row-2">
            <Field label="Live Demo URL" value={proj.liveUrl} onChange={(v) => update(i, "liveUrl", v)} />
            <Field label="GitHub URL" value={proj.githubUrl} onChange={(v) => update(i, "githubUrl", v)} />
          </div>

          <label style={{ display: "block", fontSize: 12, color: "var(--muted)", margin: "10px 0 6px", textTransform: "uppercase" }}>
            Tech Tags
          </label>
          {proj.techTags.map((tag, ti) => (
            <div key={ti} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input placeholder="Icon class" value={tag.icon} onChange={(e) => updateTag(i, ti, "icon", e.target.value)} style={{ flex: 1 }} />
              <input placeholder="Label" value={tag.label} onChange={(e) => updateTag(i, ti, "label", e.target.value)} style={{ flex: 2 }} />
              <button type="button" className="array-block-remove" style={{ position: "static" }} onClick={() => removeTag(i, ti)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn-add" onClick={() => addTag(i)}>
            <i className="fa-solid fa-plus"></i> Add Tech Tag
          </button>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={addProject}>
        <i className="fa-solid fa-plus"></i> Add Project
      </button>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
