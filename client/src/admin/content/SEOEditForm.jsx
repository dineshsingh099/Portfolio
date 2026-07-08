import { useState } from "react";
import Modal from "../shared/Modal";
import { Field, TextAreaField, StringListField } from "../shared/FormFields";
import { usePortfolio } from "../../context/PortfolioContext";

export default function SEOEditForm({ onClose }) {
  const { content, saveSection } = usePortfolio();
  const [data, setData] = useState(structuredClone(content.seo));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await saveSection("seo", data);
      onClose();
    } catch (err) {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit SEO Settings" onClose={onClose}>
      {error && <div className="form-error">{error}</div>}
      <Field label="Website / Site Title" value={data.siteTitle} onChange={(v) => set("siteTitle", v)} />
      <Field label="Meta Title" value={data.metaTitle} onChange={(v) => set("metaTitle", v)} />
      <TextAreaField label="Meta Description" value={data.metaDescription} onChange={(v) => set("metaDescription", v)} rows={3} />
      <StringListField label="Keywords" items={data.metaKeywords} onChange={(v) => set("metaKeywords", v)} placeholder="e.g. React Developer" />
      <Field label="OG / Social Preview Image URL" value={data.ogImage} onChange={(v) => set("ogImage", v)} />
      <Field label="Canonical URL" value={data.canonicalUrl} onChange={(v) => set("canonicalUrl", v)} />
      <div className="form-row-2">
        <Field label="Google Analytics ID" value={data.googleAnalyticsId} onChange={(v) => set("googleAnalyticsId", v)} />
        <Field label="Google Site Verification" value={data.googleSiteVerification} onChange={(v) => set("googleSiteVerification", v)} />
      </div>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
      </div>
    </Modal>
  );
}
