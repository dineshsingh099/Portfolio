import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPanel() {
  const { changePassword, email } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    </div>
  );
}
