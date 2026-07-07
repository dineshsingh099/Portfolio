export default function Projects({ projects }) {
  return (
    <section className="projects section-editable" id="projects">
      <div className="eyebrow-center">
        <div className="eyebrow">MY WORK</div>
      </div>
      <h2 className="section-title centered">Featured Projects</h2>

      <div className="project-grid">
        {projects.map((proj) => (
          <div className="project-card reveal" key={proj.id}>
            <div className="project-thumbnail">
              <img src={proj.image} alt={proj.title} loading="lazy" />
              <div className="project-overlay">
                <a href={proj.liveUrl} className="overlay-link" target="_blank" rel="noreferrer">
                  Live Demo <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
                <a href={proj.githubUrl} className="overlay-link ghost" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-github"></i> GitHub
                </a>
              </div>
            </div>
            <div className="project-info">
              <span className="project-number">{proj.number}</span>
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
              <div className="tech-tags">
                {proj.techTags.map((tag, i) => (
                  <span key={i}>
                    <i className={tag.icon}></i> {tag.label}
                  </span>
                ))}
              </div>
              <div className="project-links">
                <a href={proj.liveUrl} className="link-live" target="_blank" rel="noreferrer">
                  <i className="fa-solid fa-globe"></i> Live Demo
                </a>
                <a href={proj.githubUrl} className="link-github" target="_blank" rel="noreferrer">
                  <i className="fa-brands fa-github"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
