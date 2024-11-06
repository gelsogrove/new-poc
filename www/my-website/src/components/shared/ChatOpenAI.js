// src/components/shared/ChatOpenAI.js

import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"

import settings from "./settings.json"
import {
  addBotLoadingMessage,
  formatText,
  generateResponseWithContext,
  loadEmbeddingData,
  replaceBotMessageWithError,
  updateQuickReplies,
} from "./utils"

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
  let [quickReplies, setQuickReplies] = useState(settings.first_options)

  useEffect(() => {
    loadEmbeddingData(settings.embedding)
  }, [])

  const updateConversationHistory = (role, content) => {
    setConversationHistory((prevHistory) => [...prevHistory, { role, content }])
  }

  const handleSend = async (message) => {
    if (typeof message !== "string" || !message.trim()) return

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    updateConversationHistory("user", message)
    setInputValue("")
    setIsLoading(true)

    addBotLoadingMessage(setMessages)

    try {
      const matchedEntry = settings.overrides.find(
        (item) => item.question.toLowerCase() === message.toLowerCase()
      )

      if (matchedEntry) {
        setMessages((prevMessages) =>
          prevMessages.slice(0, -1).concat({
            id: crypto.randomUUID(),
            sender: "bot",
            text: matchedEntry.answer,
          })
        )
        setQuickReplies(updateQuickReplies(matchedEntry.options))
      } else {
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

        setQuickReplies(botResponse.options)
      }

      updateConversationHistory(
        "assistant",
        matchedEntry ? matchedEntry.answer : "No response available"
      )
    } catch (error) {
      console.error("Error in handling send:", error)
      replaceBotMessageWithError(setMessages, settings.error_message)
      updateConversationHistory("assistant", settings.error_message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (text) => {
    if (text === "Other") {
      setIsCustomInput(true)
    } else if (text === "Menu") {
      setQuickReplies(settings.first_options)
      setIsCustomInput(false)
    } else if (text === "Exit") {
      handleSend(settings.goodbye_message)
      setIsCustomInput(true)
    } else {
      setInputValue(text)
      handleSend(text)
    }
  }

  return (
    <div className="chat-openai">
      <h3>{settings.title}</h3>

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

      {!isCustomInput && (
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

      {isCustomInput && (
        <div className="chat-input input-group">
          <input
            type="text"
            className="form-control input-wide"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              onClick={() => handleSend(inputValue)}
              disabled={isLoading}
            >
              Send
            </button>
            <button
              className="btn btn-primary btn-wide btn-menu"
              onClick={() => handleQuickReply("Menu")}
            >
              {"Menu"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatOpenAI
