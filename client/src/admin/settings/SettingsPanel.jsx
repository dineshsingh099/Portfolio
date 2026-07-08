import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

export default function SettingsPanel() {
  const { changePassword, email } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleReset = async () => {
    if (!window.confirm("This will permanently delete ALL visitor analytics (views, devices, countries, traffic sources, heatmap, resume download count). Your portfolio content and messages will NOT be affected. Continue?")) {
      return;
    }
    setResetting(true);
    setResetDone(false);
    try {
      await api.post("/api/settings/reset-analytics");
      setResetDone(true);
    } catch (err) {
      alert("Failed to reset analytics. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess("Password changed. Redirecting to login...");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-panel">
      <h3>Account Settings</h3>
      <p className="dash-preview-text" style={{ marginBottom: 20 }}>
        Logged in as <b>{email}</b>
      </p>
      {error && <div className="form-error">{error}</div>}
      {success && <p className="form-hint" style={{ color: "#4ade80", marginBottom: 16 }}>{success}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div className="form-group">
          <label>Current Password</label>
          <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button className="btn-save" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>

      <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <h3 style={{ color: "#ff4d6d" }}>Danger Zone</h3>
        <p className="dash-preview-text" style={{ marginBottom: 16 }}>
          Reset all website analytics — portfolio views, unique visitors, device/country/traffic-source breakdowns,
          the visitor heatmap and resume download count all go back to zero, as if the site just launched. Your
          portfolio content (Hero, Projects, Skills, etc.) and contact messages are never touched.
        </p>
        {resetDone && <p style={{ color: "#00d084", fontSize: 13, marginBottom: 12 }}><i className="fa-solid fa-check"></i> Analytics reset successfully.</p>}
        <button
          className="btn-cancel"
          style={{ color: "#ff4d6d", border: "1px solid rgba(255,77,109,0.3)" }}
          onClick={handleReset}
          disabled={resetting}
        >
          <i className="fa-solid fa-rotate-left"></i> {resetting ? "Resetting..." : "Reset Website Analytics"}
        </button>
      </div>
    </div>
  );
}
