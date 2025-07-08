import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="app-name">tees</div>
      <div className="top-buttons">
        <Link to="/signup">
          <button className="signup-btn">Sign Up</button>
        </Link>
        <Link to="/signin">
          <button className="signin-btn">Log In</button>
        </Link>
      </div>
      <div className="welcome-text">
        Feeling overwhelmed?<br />Want someone to really hear you out?
      </div>
      <div className="welcome-text1">
        Try our AI Chat - Here to listen, help and guide you through anything.
      </div>
      <div className="chat-section">
        <Link to="/chat">
          <button className="chat-btn">Let’s Chat</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
