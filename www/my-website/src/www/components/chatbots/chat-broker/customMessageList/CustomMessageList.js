import React from "react"
import "./CustomMessageList.css"
import Generic from "./Generic"
import { getList } from "./getList"

const CustomMessageList = ({ messages }) => {
  const actionHandlers = {
    default: (msg) => {
      try {
        const parsedText = JSON.parse(msg.text)
        const { triggerAction } = parsedText

        switch (triggerAction) {
          case "welcome":
          case "removeClient":
          case "editClient":
          case "getClient":
          case "addClient":
          case "countClients":
            return <Generic msg={parsedText} />
          case "getListClient":
          case "expireFEIN":
          case "expireNotario":
          case "expireSIM":
            return getList(parsedText, true)
          default:
            return (
              <pre className="message-text">
                {JSON.stringify(parsedText, null, 2)}
              </pre>
            )
        }
      } catch (e) {
        console.error("Error parsing text:", e)
        return <span>{msg.text}</span>
      }
    },
  }

  return (
    <div className="chat-custom-messages">
      {messages
        .filter((msg) => msg.sender !== "system")
        .map((msg, index) => {
          const handler =
            actionHandlers[msg.triggerAction] || actionHandlers.default
          return (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <span className="message-text">{handler(msg)}</span>
              {msg.sender === "bot" && index !== 0 && msg.text !== "..." && (
                <div className="like-unlike-icons" style={{ float: "right" }}>
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
          )
        })}
    </div>
  )
}

const handleUnlike = (id) => {
  console.log(`Unliked message with id: ${id}`)
}

export default CustomMessageList
