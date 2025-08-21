import React, { useState } from "react";
import "../../healthmate/src/css/styles.css"
import { FaHeartbeat } from "react-icons/fa";

function App() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Tell me your symptoms and I'll try to help." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    // Simulate bot response, replace this with real API call & logic
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `You said: ${input}. (Simulated response)` },
      ]);
    }, 1000);
    setInput("");
  };

  return (
    <div className="container">
      <header className="header">
        <FaHeartbeat className="header-icon" />
        <h1>HealthMate</h1>
        <p>Your AI Symptom Checker Bot</p>
      </header>
      <div className="chat-box">
        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.from === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Describe your symptoms..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="button-send" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
