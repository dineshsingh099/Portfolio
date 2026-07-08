import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePortfolio } from "../../context/PortfolioContext";
import useMessages from "../messages/useMessages";
import useAdminProfile from "../profile/useAdminProfile";
import { fileToCompressedDataUrl } from "../shared/imageUtils";
import NotificationsBell from "../notifications/NotificationsBell";
import { DashPanelSkeleton } from "../dashboard/DashboardSkeleton";


const OverviewPanel = lazy(() => import("./OverviewPanel"));
const SectionManager = lazy(() => import("../content/SectionManager"));
const SettingsPanel = lazy(() => import("../settings/SettingsPanel"));
const MessagesPage = lazy(() => import("../messages/MessagesPage"));
const MediaLibraryPage = lazy(() => import("../settings/MediaLibraryPage"));
const SocialLinksPage = lazy(() => import("../settings/SocialLinksPage"));
const VisitorsAnalyticsPage = lazy(() => import("../analytics/VisitorsAnalyticsPage"));


const PANEL_SKELETON_VARIANT = {
  overview: "cards",
  visitors: "cards",
  messages: "list",
  media: "list",
  social: "list",
  settings: "form",
};

const WEBSITE_ITEMS = [
  { key: "hero", label: "Hero Section", icon: "fa-solid fa-house" },
  { key: "about", label: "About", icon: "fa-solid fa-user" },
  { key: "skills", label: "Skills", icon: "fa-solid fa-code" },
  { key: "experience", label: "Experience", icon: "fa-solid fa-briefcase" },
  { key: "education", label: "Education", icon: "fa-solid fa-graduation-cap" },
  { key: "projects", label: "Projects", icon: "fa-solid fa-diagram-project" },
  { key: "certifications", label: "Certificates", icon: "fa-solid fa-certificate" },
  { key: "resume", label: "Resume", icon: "fa-regular fa-file-pdf" },
  { key: "contact", label: "Contact", icon: "fa-solid fa-envelope" },
];

const MAIN_ITEMS = [
  { key: "overview", label: "Dashboard", icon: "fa-solid fa-gauge-high" },
  { key: "__website", label: "Website", icon: "fa-solid fa-globe", group: true },
  { key: "messages", label: "Messages", icon: "fa-solid fa-inbox" },
  { key: "testimonials", label: "Testimonials", icon: "fa-solid fa-star" },
  { key: "blogs", label: "Blogs", icon: "fa-solid fa-blog", badge: "Soon" },
  { key: "visitors", label: "Visitors Analytics", icon: "fa-solid fa-chart-line" },
];

const MANAGEMENT_ITEMS = [
  { key: "media", label: "Media Library", icon: "fa-solid fa-photo-film" },
  { key: "seo", label: "SEO", icon: "fa-solid fa-magnifying-glass-chart" },
  { key: "social", label: "Social Links", icon: "fa-solid fa-share-nodes" },
];

const ALL_SEARCHABLE = [...MAIN_ITEMS.filter((i) => !i.group), ...WEBSITE_ITEMS, ...MANAGEMENT_ITEMS];

function labelFor(key) {
  return ALL_SEARCHABLE.find((i) => i.key === key)?.label || "Dashboard";
}

function AdminAvatar({ name, avatar, size = 40, editable = false, onPick, uploading = false }) {
  const inputRef = useRef(null);
  const initials =
    (name || "A")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "A";

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file && onPick) onPick(file);
  };

  const content = avatar ? (
    <img src={avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, var(--cyan), var(--purple))",
        color: "#04101f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );

  if (!editable) {
    return <div style={circleStyle}>{content}</div>;
  }

  return (
    <button
      type="button"
      title="Change profile photo"
      onClick={() => inputRef.current?.click()}
      style={{ ...circleStyle, border: "none", padding: 0, cursor: "pointer" }}
    >
      {content}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          opacity: 0,
          transition: "opacity 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size * 0.32,
        }}
        className="avatar-hover-overlay"
      >
        <i className={`fa-solid ${uploading ? "fa-spinner fa-spin" : "fa-camera"}`}></i>
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </button>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [websiteOpen, setWebsiteOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("dash_theme") || "dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [autoEditSection, setAutoEditSection] = useState(null);

  const { logout, email } = useAuth();
  const { content, loading } = usePortfolio();
  const { unread } = useMessages();
  const { avatar, setAvatar } = useAdminProfile();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const adminName = `${content?.hero?.firstName || ""} ${content?.hero?.lastName || ""}`.trim() || "Admin";
  const adminPhone = content?.contact?.phone || "";

  const handleAvatarPick = async (file) => {
    setAvatarUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      await setAvatar(dataUrl);
    } catch (err) {
      alert("Could not update profile photo. Please try a different image.");
    } finally {
      setAvatarUploading(false);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-dash-theme", theme);
    localStorage.setItem("dash_theme", theme);
  }, [theme]);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") searchRef.current?.blur();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const goTo = (key) => {
    if (WEBSITE_ITEMS.some((w) => w.key === key)) setWebsiteOpen(true);
    setActive(key);
    setSidebarOpen(false);
  };

  const handleQuickAction = (key) => {
    setAutoEditSection(key);
    goTo(key);
  };

  const searchResults = searchTerm
    ? ALL_SEARCHABLE.filter((i) => i.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const renderContent = () => {
    if (active === "overview") return <OverviewPanel onQuickAction={handleQuickAction} />;
    if (active === "settings") return <SettingsPanel />;
    if (active === "messages") return <MessagesPage />;
    if (active === "media") return <MediaLibraryPage />;
    if (active === "social") return <SocialLinksPage />;
    if (active === "visitors") return <VisitorsAnalyticsPage />;
    if (active === "blogs") return <ComingSoonPage label="Blogs" />;
    return (
      <SectionManager
        sectionKey={active}
        autoEdit={autoEditSection === active}
        onAutoEditConsumed={() => setAutoEditSection(null)}
      />
    );
  };

  const contentNeedsPortfolio = !["overview", "settings", "messages", "media", "social", "visitors", "blogs"].includes(active);

  return (
    <div className="dash-shell page-enter">
      {/* Tapping outside the sidebar closes it too, same as the X button. */}
      {sidebarOpen && <div className="dash-sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`dash-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="dash-sidebar-top">
          <div className="dash-logo">
            DS<span>.</span>
          </div>
          <button
            type="button"
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="dash-profile-card">
          <AdminAvatar name={adminName} avatar={avatar} size={44} editable onPick={handleAvatarPick} uploading={avatarUploading} />
          <div>
            <h4>{adminName}</h4>
            <p>Super Admin</p>
            <span className="dash-online"><i className="fa-solid fa-circle"></i> Online</span>
          </div>
        </div>

        <nav>
          <p className="dash-nav-label">MAIN MENU</p>
          {MAIN_ITEMS.map((item) =>
            item.group ? (
              <div key={item.key}>
                <button
                  className={`dash-nav-item${WEBSITE_ITEMS.some((w) => w.key === active) ? " active" : ""}`}
                  onClick={() => setWebsiteOpen((v) => !v)}
                >
                  <i className={item.icon}></i> {item.label}
                  <i className={`fa-solid fa-chevron-${websiteOpen ? "up" : "down"} dash-chevron`}></i>
                </button>
                {websiteOpen && (
                  <div className="dash-subnav">
                    {WEBSITE_ITEMS.map((sub) => (
                      <button
                        key={sub.key}
                        className={`dash-nav-item sub${active === sub.key ? " active" : ""}`}
                        onClick={() => goTo(sub.key)}
                      >
                        <i className={sub.icon}></i> {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.key}
                className={`dash-nav-item${active === item.key ? " active" : ""}`}
                onClick={() => goTo(item.key)}
              >
                <i className={item.icon}></i> {item.label}
                {item.key === "messages" && unread > 0 && <span className="dash-nav-badge">{unread}</span>}
                {item.badge && <span className="dash-nav-soon">{item.badge}</span>}
              </button>
            )
          )}

          <p className="dash-nav-label">MANAGEMENT</p>
          {MANAGEMENT_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`dash-nav-item${active === item.key ? " active" : ""}`}
              onClick={() => goTo(item.key)}
            >
              <i className={item.icon}></i> {item.label}
            </button>
          ))}

          <p className="dash-nav-label">SYSTEM</p>
          <button className={`dash-nav-item${active === "settings" ? " active" : ""}`} onClick={() => goTo("settings")}>
            <i className="fa-solid fa-gear"></i> Settings
          </button>
          <button className="dash-nav-item" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer" className="dash-view-site">
            <i className="fa-solid fa-arrow-up-right-from-square"></i> View Live Portfolio
          </a>
          <p className="dash-version">Version 1.0.0<br />Last Login: {new Date().toLocaleString()}</p>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button className="dash-menu-toggle" onClick={() => setSidebarOpen((v) => !v)}>
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="dash-topbar-title">
            <h2>{active === "overview" ? "Dashboard" : labelFor(active)}</h2>
            <p>Welcome back, {adminName} 👋</p>
          </div>

          <div className="dash-search-wrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              ref={searchRef}
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            />
            <kbd>Ctrl + K</kbd>
            {searchFocused && searchTerm && (
              <div className="dash-search-results">
                {searchResults.length === 0 && <div className="dash-search-empty">No matches</div>}
                {searchResults.map((r) => (
                  <button
                    key={r.key}
                    onMouseDown={() => {
                      goTo(r.key);
                      setSearchTerm("");
                    }}
                  >
                    <i className={r.icon}></i> {r.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="dash-topbar-right">
            <button className="dash-theme-toggle" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
              <i className={`fa-solid fa-${theme === "dark" ? "moon" : "sun"}`}></i>
            </button>
            <NotificationsBell />
            <div className="dash-user" ref={profileRef}>
              <button className="dash-user-btn" onClick={() => setProfileOpen((v) => !v)} aria-label="Profile menu">
                <AdminAvatar name={adminName} avatar={avatar} size={36} />
              </button>
              {profileOpen && (
                <div className="dash-profile-dropdown">
                  <div className="dash-profile-dropdown-info">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <AdminAvatar name={adminName} avatar={avatar} size={48} editable onPick={handleAvatarPick} uploading={avatarUploading} />
                      <span style={{ fontSize: 11, color: "var(--db-muted)" }}>
                        <i className="fa-solid fa-camera"></i> Click photo to change
                      </span>
                    </div>
                    <h4>{adminName}</h4>
                    <p><i className="fa-solid fa-envelope"></i> {email}</p>
                    {adminPhone && <p><i className="fa-solid fa-phone"></i> {adminPhone}</p>}
                  </div>
                  <button onClick={() => { goTo("settings"); setProfileOpen(false); }}><i className="fa-solid fa-user"></i> My Profile</button>
                  <button onClick={() => { goTo("settings"); setProfileOpen(false); }}><i className="fa-solid fa-key"></i> Change Password</button>
                  <button onClick={() => { goTo("settings"); setProfileOpen(false); }}><i className="fa-solid fa-gear"></i> Settings</button>
                  <button onClick={handleLogout} className="danger"><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="dash-content">
          {loading && contentNeedsPortfolio ? (
            <DashPanelSkeleton variant="form" />
          ) : (
            <Suspense fallback={<DashPanelSkeleton variant={PANEL_SKELETON_VARIANT[active] || "form"} />}>
              {/* key={active} restarts the fade-in on every tab switch so
                  each panel visibly settles into place instead of popping. */}
              <div key={active} className="section-enter">
                {renderContent()}
              </div>
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
