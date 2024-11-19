import React from "react"
import "./MessageListSource.css"

const MessageListSource = ({ messages }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`chat-message ${
            msg.sender === "user" ? "user-message" : "bot-message"
          }`}
        >
          <pre className="message-text">
            {(() => {
              try {
                const parsedText = JSON.parse(msg.text)
                return JSON.stringify(parsedText, null, 2)
              } catch (e) {
                return msg.text // Ritorna il testo originale se non è un JSON valido
              }
            })()}
          </pre>
        </div>
      ))}
    </div>
  )
}

export default MessageListSource
