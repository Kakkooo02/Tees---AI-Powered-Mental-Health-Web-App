import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="app-name">tees</div>
      <button className="setting-btn" onClick={() => navigate("/settings")}>
        ⚙️
      </button>
      <button className="logout-btn" onClick={() => navigate("/")}>
        Log Out
      </button>
      <div className="buttons-grid">
        <button className="dashboard-btn" onClick={() => navigate("/mood")}>
          <span>Mood Tracker</span>
        </button>
        <button className="dashboard-btn" onClick={() => navigate("/chat")}>
          <span>AI Chat</span>
        </button>
        <button className="dashboard-btn" onClick={() => navigate("/fitnessFull")}>
          <span>Exercise</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
