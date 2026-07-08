import { useMemo, useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";

export default function MediaLibraryPage() {
  const { content } = usePortfolio();
  const [copied, setCopied] = useState("");

  const items = useMemo(() => {
    if (!content) return [];
    const list = [];
    if (content.hero.profileImage) list.push({ url: content.hero.profileImage, name: "Profile Image", folder: "Hero" });
    (content.projects || []).forEach((p) => p.image && list.push({ url: p.image, name: p.title || "Project", folder: "Projects" }));
    (content.certifications || []).forEach((c) => c.fileUrl && list.push({ url: c.fileUrl, name: c.title || "Certificate", folder: "Certificates" }));
    (content.testimonials || []).forEach((t) => t.avatar && list.push({ url: t.avatar, name: t.name || "Testimonial", folder: "Testimonials" }));
    if (content.resume.fileUrl) list.push({ url: content.resume.fileUrl, name: "Resume", folder: "Resume" });
    if (content.seo?.ogImage) list.push({ url: content.seo.ogImage, name: "OG / Social Image", folder: "SEO" });
    return list;
  }, [content]);

  const copy = (url) => {
    navigator.clipboard?.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  const isImage = (url) => /\.(png|jpe?g|webp|gif|svg)$/i.test(url);

  return (
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h3>Media Library</h3>
      </div>
      <p className="dash-preview-text">
        Every image and file currently referenced across your portfolio content, gathered in one place. To change one,
        edit it from its section (Hero, Projects, Certificates, etc.) — this view is read-only for now.
      </p>
      <div className="media-grid">
        {items.length === 0 && <p className="muted">No media found yet.</p>}
        {items.map((item, i) => (
          <div className="media-card" key={i}>
            <div className="media-thumb">
              {isImage(item.url) ? (
                <img src={item.url} alt={item.name} onError={(e) => (e.currentTarget.style.opacity = 0.2)} />
              ) : (
                <i className="fa-regular fa-file-pdf"></i>
              )}
            </div>
            <div className="media-card-body">
              <h4>{item.name}</h4>
              <span className="media-folder">{item.folder}</span>
              <button onClick={() => copy(item.url)}>
                <i className={`fa-solid ${copied === item.url ? "fa-check" : "fa-link"}`}></i> {copied === item.url ? "Copied" : "Copy URL"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
