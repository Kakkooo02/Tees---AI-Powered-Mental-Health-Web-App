import React, { useState } from "react";
import "../styles/MoodTracker.css";

const MoodTracker = () => {
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [explanation, setExplanation] = useState("");
  const [moodEntries, setMoodEntries] = useState([]);

  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmoji || !explanation) {
      alert("Please select an emoji and explain your feelings!");
      return;
    }

    const newEntry = {
      id: Date.now(), // Temporary ID for frontend usage
      emoji: selectedEmoji,
      explanation,
      timestamp: new Date().toISOString(), // Current timestamp
    };

    setMoodEntries([newEntry, ...moodEntries]); // Update mood entries locally
    setExplanation(""); // Clear the explanation
    setSelectedEmoji(""); // Deselect the emoji
  };

  return (
    <div className="mood-container">
      <h1>How are you feeling today?</h1>
      <div className="emoji-container">
        {["😀", "🙂", "😐", "🙁", "😢"].map((emoji, index) => (
          <button
            key={index}
            className={`emoji ${selectedEmoji === emoji ? "selected" : ""}`}
            onClick={() => handleEmojiClick(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Why are you feeling this way?"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <h2>Your Past Entries</h2>
      <div className="entries">
        {moodEntries.map((entry) => (
          <div key={entry.id} className="entry">
            <span className="entry-emoji">{entry.emoji}</span>
            <span className="entry-text">{entry.explanation}</span>
            <span className="entry-timestamp">
              {new Date(entry.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
