import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Primary pages
import Home from "./pages/Home.js";
import SignUp from "./pages/SignUp.js";
import SignIn from "./pages/SignIn.js";
import Dashboard from "./pages/Dashboard.js";
import Settings from "./pages/Settings.js";
import Chatbot from "./pages/Chatbot.js";
import Fitness from "./pages/fitnessFull.js"; 
import MoodTracker from "./pages/MoodTracker.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Primary routes */}
        <Route path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/fitnessFull" element={<Fitness />} />
        <Route path="/mood" element={<MoodTracker/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;