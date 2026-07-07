export default function Resume({ resume }) {
  return (
    <section className="resume section-editable" id="resume">
      <div className="eyebrow-center">
        <div className="eyebrow">RESUME</div>
      </div>
      <h2 className="section-title centered">My Resume</h2>

      <div className="resume-card reveal">
        <div className="resume-mock">
          <div className="mock-name"></div>
          <div className="mock-role"></div>
          <div className="mock-line"></div>
          <div className="mock-line mock-short"></div>
          <div className="mock-line"></div>
          <div className="mock-line mock-med"></div>
          <div className="mock-head"></div>
          <div className="mock-line"></div>
          <div className="mock-line mock-short"></div>
          <div className="mock-line"></div>
        </div>
        <div className="resume-info">
          <div className="resume-pdf-icon">
            <i className="fa-regular fa-file-pdf"></i>
          </div>
          <h3>{resume.name}</h3>
          <p className="resume-role">{resume.role}</p>
          <p>{resume.description}</p>
          <div className="resume-chips">
            {resume.chips.map((chip) => (
              <span key={chip}>
                <i className="fa-solid fa-check-circle"></i> {chip}
              </span>
            ))}
          </div>
          <div className="resume-actions">
            <a href={resume.fileUrl} download className="btn-primary">
              <i className="fa-solid fa-download"></i> Download PDF
            </a>
            <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="btn-outline">
              <i className="fa-solid fa-eye"></i> View Online
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
