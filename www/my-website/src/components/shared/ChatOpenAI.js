import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"
import settings from "./settings.json"
import { formatText, generateResponseWithContext } from "./utils" // Ensure formatText is imported

const ChatOpenAI = () => {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInput, setIsCustomInput] = useState(false)
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), sender: "bot", text: settings.first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: settings.first_message },
  ])
  const [showMainMenu, setShowMainMenu] = useState(true)
  const [hasExited, setHasExited] = useState(false)
  const [quickReplies, setQuickReplies] = useState(settings.first_options)
  const [embeddingData, setEmbeddingData] = useState([]) // Keep this if you plan to use it

  // Load embedding data
  useEffect(() => {
    const loadEmbeddingData = async () => {
      try {
        const response = await fetch(settings.embedding)
        if (!response.ok) throw new Error("Failed to load embedding data")
        const data = await response.json()
        setEmbeddingData(data) // Store the fetched data
      } catch (error) {
        console.error("Embedding loading error:", error)
      }
    }
    loadEmbeddingData()
  }, [])

  const updateConversationHistory = (role, content) => {
    setConversationHistory((prevHistory) => [...prevHistory, { role, content }])
  }

  const handleSend = async (message = inputValue) => {
    if (typeof message !== "string") return
    if (!message.trim()) return

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    updateConversationHistory("user", message)
    setInputValue("")
    setIsLoading(true)

    const loadingMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Generating a response for you...",
    }
    setMessages((prevMessages) => [...prevMessages, loadingMessage])

    try {
      const botResponse = await generateResponseWithContext(
        message,
        conversationHistory,
        process.env.REACT_APP_OPENAI_API_KEY
      )

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: formatText(botResponse.response),
        })
      )

      const updatedOptions = [...botResponse.options, "Other", "Exit"]
      setQuickReplies(updatedOptions)
      updateConversationHistory("assistant", botResponse.response)
      setShowMainMenu(true)
      setIsCustomInput(false)
    } catch (error) {
      console.error("Error in handling send:", error)
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: settings.error_message,
        })
      )
      updateConversationHistory("assistant", settings.error_message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (text) => {
    if (text === "Other") {
      setIsCustomInput(true)
      setShowMainMenu(false)
    } else if (text === "Exit") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: settings.goodbye_message,
        },
      ])
      setHasExited(true)
    } else {
      setInputValue(text)
      handleSend(text)
    }
  }

  return (
    <div className="chat-openai">
      <h3>Chatbot Washing Machine Assistant</h3>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <span className="message-text">
              {msg.sender === "bot" ? formatText(msg.text) : msg.text}
            </span>
          </div>
        ))}
      </div>

      {!isCustomInput && showMainMenu && !isLoading && !hasExited && (
        <div className="quick-reply-buttons d-flex flex-wrap">
          {quickReplies.map((reply, index) => (
            <div key={index} className="col-6 mb-2">
              <button
                className="btn btn-primary btn-wide"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            </div>
          ))}
        </div>
      )}

      {isCustomInput && !hasExited && (
        <div className="chat-input input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              onClick={() => handleSend()}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatOpenAI
