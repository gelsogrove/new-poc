/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import "./ChatOpenAISource.css"
import {
  addBotLoadingMessage,
  cleanText,
  formatBoldText,
  formatText,
  replaceBotMessageWithError,
} from "./utils"

import { generateResponseWithContext } from "./utils_api"

import { v4 as uuidv4 } from "uuid"
import ChatInput from "./components/chatinput/ChatInput"
import MessageList from "./components/messagelist/MessageList"

const ChatOpenAISource = ({
  first_message,
  title,
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
      const botResponse = await generateResponseWithContext(
        null,
        message,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model
      )

      const { formattedResponse } = formatText(botResponse)
      let cleanedResponse = cleanText(formattedResponse)
      cleanedResponse = formatBoldText(cleanedResponse)

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: cleanedResponse,
        })
      )

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
    if (text === "Exit") {
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

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        handleSend={handleSend}
        handleQuickReply={handleQuickReply}
      />
    </div>
  )
}

export default ChatOpenAISource
