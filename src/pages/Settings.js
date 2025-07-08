import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

function Settings() {
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  //const navigate = useNavigate();
  
  // Use dynamic API URL from configuration (or fallback to environment variable if desired)
  const BACKEND_URL = window.__CONFIG__.backendUrl;

  // Handler to update the user's name
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/update_name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        setMessage("Name updated successfully!");
      } else {
        const data = await res.json();
        console.error("Error response:", data);
        setMessage(data.error || "Error updating name.");
      }
    } catch (error) {
      console.error("Update name error:", error);
      setMessage("An unexpected error occurred while updating the name.");
    }
  };

  // Handler to update the user's password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/update_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.ok) {
        setMessage("Password updated successfully!");
      } else {
        const data = await res.json();
        console.error("Error response:", data);
        setMessage(data.error || "Error updating password.");
      }
    } catch (error) {
      console.error("Update password error:", error);
      setMessage("An unexpected error occurred while updating the password.");
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1>
      {message && (
        <p className={`message ${message.includes("success") ? "success" : "error"}`}>
          {message}
        </p>
      )}
      <div className="update-section">
        <h2>Update Name</h2>
        <form onSubmit={handleNameUpdate}>
          <label>New Name</label>
          <input
            type="text"
            placeholder="Enter new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <button type="submit">Update Name</button>
        </form>
      </div>
      <div className="update-section">
        <h2>Update Password</h2>
        <form onSubmit={handlePasswordUpdate}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
