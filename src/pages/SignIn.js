import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignIn.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  // Use the dynamic backend URL
  const BACKEND_URL = window.__CONFIG__.backendUrl;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important to include credentials if using sessions
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        alert("Invalid credentials, try again!");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("An error occurred during sign in.");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
