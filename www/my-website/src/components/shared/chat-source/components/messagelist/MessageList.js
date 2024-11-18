import React from "react"
import "./MessageList.css"

const MessageList = ({ messages }) => {
  console.log("messages input:", messages) // Aggiungi questo log per vedere i valori di input

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message ${
            msg.sender === "user" ? "user-message" : "bot-message"
          }`}
        >
          <span
            className="message-text"
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        </div>
      ))}
    </div>
  )
}

export default MessageList
