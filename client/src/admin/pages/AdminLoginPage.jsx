import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";

export default function AdminLoginPage() {
  const { login, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentials = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      setStep("otp");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await verifyLoginOtp(email, code);
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-screen">
      <div className="admin-auth-card">
        <div className="admin-auth-logo">
          DS<span>.</span>
        </div>
        <h1>Admin Login</h1>
        <p className="admin-auth-sub">Sign in to manage your portfolio content</p>

        {error && <div className="form-error">{error}</div>}

        {step === "credentials" && (
          <form onSubmit={handleCredentials}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button className="btn-save admin-auth-submit" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
            <Link to="/admin/forgot-password" className="admin-auth-link">
              Forgot password?
            </Link>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtp}>
            <p className="form-hint" style={{ marginBottom: 16 }}>
              A one-time code was sent to <b>{email}</b>.
            </p>
            <div className="form-group">
              <label>Enter 6-digit OTP</label>
              <input
                className="otp-input"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="------"
              />
            </div>
            <button className="btn-save admin-auth-submit" disabled={loading || code.length !== 6}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        <Link to="/" className="admin-auth-back">
          <i className="fa-solid fa-arrow-left"></i> Back to portfolio
        </Link>
      </div>
    </div>
  );
}
