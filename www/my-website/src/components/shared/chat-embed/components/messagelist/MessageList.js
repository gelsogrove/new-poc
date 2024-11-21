import React from "react"
import "./MessageList.css"

const MessageList = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message ${
            msg.sender === "user" ? "user-message" : "bot-message"
          }`}
        >
          <span className="message-text">
            {/* Usa msg.text direttamente per visualizzare il testo */}
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
          </span>
        </div>
      ))}
    </div>
  )
}

export default MessageList
