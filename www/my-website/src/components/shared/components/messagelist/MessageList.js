import React from "react"
import "./MessageList.css"

const MessageList = ({ messages, IsReturnTable }) => {
  return (
    <div className="chat-messages">
      {messages.map((msg, index) => (
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
                      return msg.text // Ritorna JSON
                    })()}
              </pre>
            ) : (
              // Caso quando IsReturnTable è false
              (() => {
                try {
                  const parsedText = JSON.parse(msg.text)
                  return JSON.stringify(parsedText, null, 2)
                } catch (e) {
                  return <span dangerouslySetInnerHTML={{ __html: msg.text }} /> //ritorna HTML
                }
              })()
            )}
          </span>
          {msg.sender === "bot" && index !== 0 && msg.text !== "..." && (
            <div className="like-unlike-icons" style={{ float: "right" }}>
              <span
                role="img"
                aria-label="like"
                onClick={() => handleLike(msg.id)}
                title="Like"
              >
                👍
                <div className="icon-label">Like</div>
              </span>
              <span
                role="img"
                aria-label="unlike"
                onClick={() => handleUnlike(msg.id)}
                title="Unlike"
              >
                👎
                <div className="icon-label">Unlike</div>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const handleLike = (id) => {
  console.log(`Liked message with id: ${id}`)
}

const handleUnlike = (id) => {
  console.log(`Unliked message with id: ${id}`)
}

export default MessageList
