import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"

import settings from "./settings.json"
import {
  addBotLoadingMessage,
  cleanText,
  convertQuestionToEmbedding,
  findBestMatchInEmbeddings,
  formatText,
  generateResponseWithContext,
  loadEmbeddingData,
  navigateToPDFPage,
  replaceBotMessageWithError,
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
  const [quickReplies, setQuickReplies] = useState(settings.first_options)
  const [embeddingData, setEmbeddingData] = useState(null) // State to store embedding data

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching embedding data from:", settings.embedding)
      try {
        const data = await loadEmbeddingData(settings.embedding)
        setEmbeddingData(data) // Store embedding data in state
        console.log("Embedding data loaded successfully:", data) // For debugging
      } catch (error) {
        console.error("Error loading embedding data:", error)
      }
    }

    fetchData()
  }, []) // Runs once on mount

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
      const questionEmbedding = await convertQuestionToEmbedding(message)
      const bestMatch = findBestMatchInEmbeddings(
        embeddingData,
        questionEmbedding
      )

      // Generate response with context based on the best match
      const botResponse = await generateResponseWithContext(
        bestMatch,
        message,
        conversationHistory
      )

      // Format the bot response to get the response text and options
      const { formattedResponse, options, page } = formatText(botResponse)

      const cleanedResponse = cleanText(formattedResponse)
      const updatedOptions = Array.from(new Set([...options, "Other", "Menu"]))

      if (page) {
        navigateToPDFPage(page) // Naviga alla pagina specificata
      }

      // Update messages with the formatted response
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: cleanedResponse, // Only the response text
        })
      )

      // Update quick replies with the options
      setQuickReplies(updatedOptions)
      updateConversationHistory("assistant", formattedResponse)
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
            <span
              className="message-text"
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
            {/* The above line renders the HTML content correctly */}
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
                {reply} {/* The reply text from options */}
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
