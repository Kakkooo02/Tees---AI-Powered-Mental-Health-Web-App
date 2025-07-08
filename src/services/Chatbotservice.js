// Chatbotservice.js
import axios from "axios";

// Use the global backend URL from the index.html configuration,
// then append the /chat endpoint.
const API_URL = `${window.__CONFIG__.backendUrl}/chat`;

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(
      API_URL,
      { text: message },
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error connecting to chatbot:", error);
    return { reply: "Sorry, Tee couldn't connect 😔. Try again later!" };
  }
};
