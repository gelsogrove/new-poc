import React from "react"
import "./MessageList.css"

const MessageList = ({ messages, IsReturnTable }) => {
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
            {/* Logica per gestire IsReturnTable */}
            {IsReturnTable ? (
              <pre className="message-text">
                {msg.text === "almogavers"
                  ? "*******"
                  : (() => {
                      try {
                        const parsedText = JSON.parse(msg.text)
                        return JSON.stringify(parsedText, null, 2)
                      } catch (e) {
                        return msg.text // Ritorna il testo originale se non è un JSON valido
                      }
                    })()}
              </pre>
            ) : (
              // Caso quando IsReturnTable è false
              (() => {
                try {
                  const parsedText = JSON.parse(msg.text)
                  return JSON.stringify(parsedText, null, 2)
                } catch (e) {
                  return <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                }
              })()
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

export default MessageList
