// src/components/shared/ChatOpenAI.js

import React, { useState } from "react"
import "./ChatOpenAI.css"

const ChatOpenAI = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hello, how can I help you?" },
    { id: 2, sender: "bot", text: "Hi! I need assistance with my order." },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (inputValue.trim() === "") return
    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
    }
    setMessages([...messages, newMessage])
    setInputValue("")

    // Simulazione risposta bot
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: "This is a bot response.",
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    }, 1000)
  }

  return (
    <div className="chat-openai">
      <h3>Custom Chatbot</h3>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default ChatOpenAI
