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
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import ForgotPasswordPage from "./admin/pages/ForgotPasswordPage";
import AdminDashboard from "./admin/pages/AdminDashboard";
import useReveal from "./hooks/useReveal";
import usePageTracking from "./hooks/usePageTracking";

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
      <CursorFX />
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
          <Routes>
            <Route path="/" element={<PortfolioSite />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
