import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"

import settings from "./settings.json"
import { formatText, generateResponseWithContext } from "./utils"

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

  // Load embedding data if necessary
  useEffect(() => {
    const loadEmbeddingData = async () => {
      try {
        const response = await fetch(settings.embedding)
        if (!response.ok) throw new Error("Failed to load embedding data")
        await response.json()
      } catch (error) {
        console.error("Embedding loading error:", error)
      }
    }
    loadEmbeddingData()
  }, [])

  const updateConversationHistory = (role, content) => {
    setConversationHistory((prevHistory) => [...prevHistory, { role, content }])
  }

  const handleSend = async (message) => {
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
      // Check against predefined questions
      const matchedEntry = settings.overrides.find(
        (item) => item.question.toLowerCase() === message.toLowerCase()
      )
      if (matchedEntry) {
        // If a match is found, display the predefined answer and options
        setMessages((prevMessages) =>
          prevMessages.slice(0, -1).concat({
            id: crypto.randomUUID(),
            sender: "bot",
            text: matchedEntry.answer,
          })
        )

        // TODO : FAI UNA FUNZIONE
        if (!matchedEntry.options.includes("Other")) {
          matchedEntry.options.push("Other")
        }
        if (!matchedEntry.options.includes("Menu")) {
          matchedEntry.options.push("Menu")
        }

        setQuickReplies(matchedEntry.options)
      } else {
        // If no match is found, call OpenAI API
        const botResponse = await generateResponseWithContext(
          message,
          conversationHistory,
          process.env.REACT_APP_OPENAI_API_KEY
        )

        // Add bot response to messages
        setMessages((prevMessages) =>
          prevMessages.slice(0, -1).concat({
            id: crypto.randomUUID(),
            sender: "bot",
            text: formatText(botResponse.response),
          })
        )

        // Set quick replies based on the options from the bot response
        setQuickReplies(botResponse.options) // Update quick replies
      }

      updateConversationHistory(
        "assistant",
        matchedEntry ? matchedEntry.answer : "No response available"
      )
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
              onClick={() => handleSend(inputValue)} // Send typed message
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

// TODO:
// FARE GIT PIU CORTI
// deve andare la pagination
// CLEAN code
// dividere in compoenti
// store the language, menu should be in english
