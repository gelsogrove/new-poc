// src/components/shared/ChatOpenAI.js

import React, { useState } from "react"
import "./ChatOpenAI.css"

const ChatOpenAI = ({ type }) => {
  // Messaggio di benvenuto diverso in base al tipo di chatbot
  let welcomeMessage
  if (type === "custom-chatbot") {
    welcomeMessage = "Hello! How can I help you?"
  } else if (type === "generative") {
    welcomeMessage = "Welcome to Generative AI Chat!"
  }

  const initialMessages = [{ id: 1, sender: "bot", text: welcomeMessage }]

  const [messages, setMessages] = useState(initialMessages)
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

    // Risposta simulata del bot
    setTimeout(() => {
      let botResponse = "I'm here to help!"
      if (type === "custom") {
        botResponse = "This is a response from the Custom Chatbot."
      } else if (type === "generative") {
        botResponse = "Generating a response for you..."
      }
      const botMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: botResponse,
      }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    }, 1000)
  }

  return (
    <div className="chat-openai">
      <h3>{type === "custom" ? "Custom Chatbot" : "Generative AI Chatbot"}</h3>
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
