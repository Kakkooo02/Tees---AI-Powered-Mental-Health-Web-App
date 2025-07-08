import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  // Get the backend URL from the config set in index.html
  const backendUrl = window.__CONFIG__.backendUrl;

  // To send a message to the /chat endpoint
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user's message to the conversation
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Add a "typing" indicator for the bot
    setMessages((prev) => [
      ...prev,
      { text: "Typing...", sender: "bot", typing: true },
    ]);

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send cookies for session auth if any
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error("Chat API error");
      }

      const data = await response.json();
      // Replace the typing indicator with the actual bot response
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Sorry, something went wrong. 🙁", sender: "bot" },
      ]);
    }
    setInput("");
  };

  // Auto-scroll when messages update
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender} ${msg.typing ? "typing" : ""}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          placeholder="Talk to tees..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
