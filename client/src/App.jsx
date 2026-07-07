import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Timeline from "./components/Timeline";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CursorFX from "./components/CursorFX";
import ProtectedRoute from "./admin/ProtectedRoute";
import useReveal from "./hooks/useReveal";
import usePageTracking from "./hooks/usePageTracking";

// Admin pages are only needed by the site owner, not by regular visitors.
// Lazy-loading them keeps the admin dashboard, edit forms, etc. out of the
// main bundle that every visitor downloads — the public portfolio loads
// faster, and admin code is only fetched when someone actually visits
// /admin/*.
const AdminLoginPage = lazy(() => import("./admin/pages/AdminLoginPage"));
const ForgotPasswordPage = lazy(() => import("./admin/pages/ForgotPasswordPage"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));

function AdminFallback() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading admin panel...</p>
    </div>
  );
}

function PortfolioSite() {
  const { content, loading, error } = usePortfolio();
  useReveal([content]);
  usePageTracking();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="error-screen">
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 32, color: "#ff8080" }}></i>
        <p>{error || "Something went wrong."}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar resumeUrl={content.hero.resumeUrl} />
      <Hero hero={content.hero} />
      <About about={content.about} resumeUrl={content.hero.resumeUrl} />
      <Skills skills={content.skills} />
      <Timeline
        id="experience"
        eyebrowText="WORK EXPERIENCE"
        title="Professional Journey"
        items={content.experience}
        dotClass="exp-dot"
        badgeClass="exp"
        section="experience"
      />
      <Timeline
        id="education"
        eyebrowText="EDUCATION"
        title="Academic Background"
        items={content.education}
        dotClass="edu-dot"
        badgeClass="edu"
        section="education"
      />
      <Projects projects={content.projects} />
      <Certifications certifications={content.certifications} />
      <Resume resume={content.resume} />
      <Contact contact={content.contact} />
      <Footer />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PortfolioProvider>
          <CursorFX />
          <Routes>
            <Route path="/" element={<PortfolioSite />} />
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLoginPage />
                </Suspense>
              }
            />
            <Route
              path="/admin/forgot-password"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ForgotPasswordPage />
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<AdminFallback />}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
