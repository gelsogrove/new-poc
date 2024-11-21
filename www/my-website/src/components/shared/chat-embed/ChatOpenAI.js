import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"
import {
  addBotLoadingMessage,
  cleanText,
  findBestMatchInEmbeddings,
  formatBoldText,
  formatText,
  loadEmbeddingData,
  navigateToPDFPage,
  replaceBotMessageWithError,
} from "./utils"

import {
  convertQuestionToEmbedding,
  generateResponseWithContext,
} from "./utils_api"

import { v4 as uuidv4 } from "uuid"
import ChatInput from "./components/chatinput/ChatInput"
import MessageList from "./components/messagelist/MessageList"
import QuickReplies from "./components/quickreplies/QuickReplies"

const ChatOpenAI = ({
  embedding,
  first_message,
  first_options,
  title,
  overrides,
  systemPrompt,
  max_tokens,
  temperature,
  model,
  error_message,
  goodbye_message,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInput, setIsCustomInput] = useState(false)
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])
  const [quickReplies, setQuickReplies] = useState(first_options)
  const [embeddingData, setEmbeddingData] = useState(null)
  const [chatbotResponse, setChatbotResponse] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadEmbeddingData(embedding)
        setEmbeddingData(data)
      } catch (error) {
        console.error("Error loading embedding data:", error)
      }
    }

    fetchData()
  }, [embedding])

  useEffect(() => {
    if (systemPrompt) {
      updateConversationHistory("assistant", systemPrompt)
    }
  }, [systemPrompt])

  const updateConversationHistory = (role, content) => {
    setConversationHistory((prevHistory) => [...prevHistory, { role, content }])
  }

  const handleSend = async (message) => {
    if (typeof message !== "string" || !message.trim()) return

    const userMessage = {
      id: uuidv4(),
      sender: "user",
      text: message,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    updateConversationHistory("user", message)
    setInputValue("")
    setIsLoading(true)

    addBotLoadingMessage(setMessages)

    try {
      const questionEmbedding = await convertQuestionToEmbedding(message, model)
      const bestMatch = findBestMatchInEmbeddings(
        embeddingData,
        questionEmbedding
      )

      const botResponse = await generateResponseWithContext(
        bestMatch,
        message,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model
      )

      const { formattedResponse, options, page } = formatText(botResponse)
      let cleanedResponse = cleanText(formattedResponse)
      cleanedResponse = formatBoldText(cleanedResponse)
      setChatbotResponse(cleanedResponse)
      const updatedOptions = Array.from(new Set([...options, "Other", "Menu"]))

      if (page) {
        navigateToPDFPage(page)
      }

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: cleanedResponse,
        })
      )

      overrides.forEach((override) => {
        if (message.toLowerCase().includes(override.word.toLowerCase())) {
          navigateToPDFPage(override.page)
        }
      })

      setQuickReplies(updatedOptions)
      updateConversationHistory("assistant", formattedResponse)
    } catch (error) {
      console.error("Error in handling send:", error)
      replaceBotMessageWithError(setMessages, error_message)
      updateConversationHistory("assistant", error_message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = (text) => {
    if (text === "Other") {
      setIsCustomInput(true)
    } else if (text === "Menu") {
      setQuickReplies(first_options)
      setIsCustomInput(false)
      navigateToPDFPage(0)
    } else if (text === "Exit") {
      handleSend(goodbye_message)
      setIsCustomInput(true)
    } else {
      setInputValue(text)
      handleSend(text)
    }
  }

  return (
    <div className="chat-openai">
      <h3>{title}</h3>

      <MessageList messages={messages} />

      {!isCustomInput && (
        <QuickReplies
          quickReplies={quickReplies}
          handleQuickReply={handleQuickReply}
        />
      )}

      {isCustomInput && (
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          handleSend={handleSend}
          handleQuickReply={handleQuickReply}
          chatbotResponse={chatbotResponse}
        />
      )}
    </div>
  )
}

export default ChatOpenAI
