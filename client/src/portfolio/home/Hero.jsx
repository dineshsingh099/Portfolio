import { useEffect, useState } from "react";

function useTypewriter(roles) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    let roleIndex = 0, charIndex = 0, deleting = false, timeoutId;

    const tick = () => {
      const current = roles[roleIndex];
      if (deleting) {
        charIndex -= 1;
        setText(current.substring(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, 60);
      } else {
        charIndex += 1;
        setText(current.substring(0, charIndex));
        if (charIndex >= current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 100);
      }
    };

    timeoutId = setTimeout(tick, 100);
    return () => clearTimeout(timeoutId);
  }, [roles]);

  return text;
}

export default function Hero({ hero }) {
  const typed = useTypewriter(hero.roles);

  const badgeIcons = ["fa-solid fa-chart-line", "fa-brands fa-react", "fa-solid fa-brain"];

  return (
    <section className="hero section-editable" id="home">
      <div className="hero-orb orb-1"></div>
      <div className="hero-orb orb-2"></div>
      <div className="hero-orb orb-3"></div>
      <div className="hero-grid"></div>

      <div className="hero-content">
        <span className="hero-greeting">
          <span className="hero-wave">👋</span> {hero.greeting}
        </span>
        <h1 className="hero-name">
          {hero.firstName}
          <br />
          <span className="gradient-text">{hero.lastName}</span>
        </h1>
        <div className="hero-role-row">
          <h2 className="hero-role-text">{typed}</h2>
          <span className="type-cursor">|</span>
        </div>
        <p className="hero-bio">{hero.bio}</p>
        <div className="hero-cta">
          <a href="#projects" className="btn-primary">
            <i className="fa-solid fa-rocket"></i> View Projects
          </a>
          <a href="#contact" className="btn-outline">Hire Me</a>
        </div>
        <div className="social-links">
          <a href={hero.socialLinks.github} target="_blank" rel="noreferrer" title="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href={hero.socialLinks.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
            <i className="fa-brands fa-linkedin"></i>
          </a>
          <a href={hero.socialLinks.instagram} target="_blank" rel="noreferrer" title="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href={`mailto:${hero.socialLinks.email}`} title="Email">
            <i className="fa-solid fa-envelope"></i>
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="profile-frame">
          <div className="profile-ring ring-1"></div>
          <div className="profile-ring ring-2"></div>
          <img src={hero.profileImage} alt={`${hero.firstName} ${hero.lastName}`} />
        </div>
        {hero.badges.map((badge, i) => (
          <div className={`role-badge badge-${i + 1}`} key={badge}>
            <i className={badgeIcons[i % badgeIcons.length]}></i> {badge}
          </div>
        ))}
      </div>
    </section>
  );
}
