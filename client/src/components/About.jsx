export default function About({ about, resumeUrl }) {
  return (
    <section className="about section-editable" id="about">
      <div className="eyebrow">ABOUT ME</div>
      <div className="about-grid">
        <div className="about-text">
          <h2 className="section-title">
            {about.heading}
            <br />
            <span className="gradient-text">{about.highlight}</span>
          </h2>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="tech-pills">
            {about.techPills.map((pill) => (
              <span key={pill}>{pill}</span>
            ))}
          </div>
          <a href={resumeUrl} download className="btn-primary about-resume-link">
            <i className="fa-solid fa-download"></i> Download Resume
          </a>
        </div>
        <div className="stat-grid">
          {about.stats.map((stat, i) => (
            <div className="stat-card reveal" key={i}>
              <div className="stat-icon">
                <i className={stat.icon}></i>
              </div>
              <h3>
                {stat.value}
                <span className="stat-suffix">{stat.suffix}</span>
              </h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
