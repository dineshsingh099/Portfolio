import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("request");
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setMessage("If this email is registered, a reset code has been sent.");
      setStep("reset");
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      navigate("/admin/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid or expired reset code");
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
        <h1>Reset Password</h1>
        <p className="admin-auth-sub">We'll email you a one-time code to reset your password</p>

        {error && <div className="form-error">{error}</div>}
        {message && step === "reset" && <p className="form-hint" style={{ marginBottom: 16 }}>{message}</p>}

        {step === "request" && (
          <form onSubmit={handleRequest}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button className="btn-save admin-auth-submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleReset}>
            <div className="form-group">
              <label>Reset Code</label>
              <input
                className="otp-input"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="------"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className="btn-save admin-auth-submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <Link to="/admin/login" className="admin-auth-back">
          <i className="fa-solid fa-arrow-left"></i> Back to login
        </Link>
      </div>
    </div>
  );
}
