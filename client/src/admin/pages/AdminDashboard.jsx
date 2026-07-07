import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import NotificationsBell from "../NotificationsBell";
import OverviewPanel from "./OverviewPanel";
import SectionManager from "./SectionManager";
import SettingsPanel from "./SettingsPanel";

const NAV_ITEMS = [
  { key: "overview", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
  { key: "hero", label: "Hero / Home", icon: "fa-solid fa-house" },
  { key: "about", label: "About", icon: "fa-solid fa-user" },
  { key: "skills", label: "Skills", icon: "fa-solid fa-code" },
  { key: "experience", label: "Experience", icon: "fa-solid fa-briefcase" },
  { key: "education", label: "Education", icon: "fa-solid fa-graduation-cap" },
  { key: "projects", label: "Projects", icon: "fa-solid fa-diagram-project" },
  { key: "certifications", label: "Certifications", icon: "fa-solid fa-certificate" },
  { key: "resume", label: "Resume", icon: "fa-regular fa-file-pdf" },
  { key: "contact", label: "Contact", icon: "fa-solid fa-envelope" },
  { key: "settings", label: "Settings", icon: "fa-solid fa-gear" },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, email } = useAuth();
  const { loading } = usePortfolio();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const activeLabel = NAV_ITEMS.find((n) => n.key === active)?.label || "Dashboard";

  return (
    <div className="dash-shell">
      <aside className={`dash-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dash-logo">
          DS<span>.</span>
        </div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`dash-nav-item${active === item.key ? " active" : ""}`}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false);
              }}
            >
              <i className={item.icon}></i> {item.label}
            </button>
          ))}
        </nav>
        <a href="/" className="dash-view-site">
          <i className="fa-solid fa-arrow-up-right-from-square"></i> View Live Site
        </a>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-toggle" onClick={() => setSidebarOpen((v) => !v)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <h2>{activeLabel}</h2>
          <div className="dash-topbar-right">
            <NotificationsBell />
            <div className="dash-user">
              <i className="fa-solid fa-circle-user"></i>
              <span>{email}</span>
            </div>
            <button className="dash-logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </header>

        <main className="dash-content">
          {loading && active !== "overview" && active !== "settings" ? (
            <div className="dash-loading">Loading content...</div>
          ) : (
            <>
              {active === "overview" && <OverviewPanel />}
              {active === "settings" && <SettingsPanel />}
              {!["overview", "settings"].includes(active) && <SectionManager sectionKey={active} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
