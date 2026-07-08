import { useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Field } from "../shared/FormFields";

export default function SocialLinksPage() {
  const { content, saveSection } = usePortfolio();
  const [links, setLinks] = useState(structuredClone(content.hero.socialLinks));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => {
    setLinks((l) => ({ ...l, [key]: val }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSection("hero", { ...content.hero, socialLinks: links });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h3>Social Links</h3>
      </div>
      <p className="dash-preview-text">These links power the social icons across your hero, navbar and footer.</p>
      <Field label="GitHub" value={links.github} onChange={(v) => set("github", v)} />
      <Field label="LinkedIn" value={links.linkedin} onChange={(v) => set("linkedin", v)} />
      <Field label="Instagram" value={links.instagram} onChange={(v) => set("instagram", v)} />
      <Field label="Contact Email" value={links.email} onChange={(v) => set("email", v)} />
      <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
        <button className="btn-save" style={{ flex: "none", padding: "10px 28px" }} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && <span style={{ color: "#00d084", marginLeft: 12 }}><i className="fa-solid fa-check"></i> Saved</span>}
      </div>
    </div>
  );
}
