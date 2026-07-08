import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#cert", label: "Certs" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ resumeUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const clickCount = useRef(0);
  const clickTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 800);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      navigate("/admin/login");
    } else {
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <a href="#home" className="nav-logo" onClick={handleLogoClick}>
        DS<span>.</span>
      </a>
      <ul className={`nav-menu${menuOpen ? " open" : ""}`} id="navMenu">
        <button className="nav-close-btn" onClick={() => setMenuOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={active === link.href.slice(1) ? "active" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a href={resumeUrl} download className="nav-resume-btn">
        <i className="fa-solid fa-download"></i> Resume
      </a>
      <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
}
