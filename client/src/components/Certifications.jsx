export default function Certifications({ certifications }) {
  return (
    <section className="certifications section-editable" id="cert">
      <div className="eyebrow-center">
        <div className="eyebrow">CERTIFICATIONS</div>
      </div>
      <h2 className="section-title centered">Courses & Achievements</h2>

      <div className="cert-grid">
        {certifications.map((cert) => (
          <div className="cert-card reveal" key={cert.id}>
            <div className="cert-icon">
              <i className={cert.icon}></i>
            </div>
            <h3>{cert.title}</h3>
            <p>{cert.description}</p>
            <span className="cert-issuer">
              <i className="fa-solid fa-building"></i> {cert.issuer}
            </span>
            <a href={cert.fileUrl} className="cert-link" target="_blank" rel="noreferrer">
              View Certificate <i className="fa-solid fa-external-link-alt"></i>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
