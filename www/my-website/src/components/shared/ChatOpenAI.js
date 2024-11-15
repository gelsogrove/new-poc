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

import ChatInput from "./components/chatinput/ChatInput"
import MessageList from "./components/messagelist/MessageList"
import QuickReplies from "./components/quickreplies/QuickReplies"

const ChatOpenAI = ({
  embedding,
  first_message,
  first_options,
  prompt,
  title,
  overrides,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInput, setIsCustomInput] = useState(false)
  const [messages, setMessages] = useState([
    { id: crypto.randomUUID(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])
  const [quickReplies, setQuickReplies] = useState(first_options)
  const [embeddingData, setEmbeddingData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadEmbeddingData(embedding)
        setEmbeddingData(data) // Store embedding data in state
      } catch (error) {
        console.error("Error loading embedding data:", error)
      }
    }

    fetchData()
  }, [embedding])

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

      // Clean the response text to remove any unwanted characters
      let cleanedResponse = cleanText(formattedResponse)
      cleanedResponse = formatBoldText(cleanedResponse)

      // Add "Other" and "Menu" options to the quick replies
      const updatedOptions = Array.from(new Set([...options, "Other", "Menu"]))

      // Navigate to the specified page
      if (page) {
        navigateToPDFPage(page)
      }

      // Update messages with the formatted response
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: cleanedResponse, // Only the response text
        })
      )

      // Check if any word overrides are present in the response
      overrides.forEach((override) => {
        // Convert both the formatted response and the keyword to lowercase
        if (
          formattedResponse.toLowerCase().includes(override.word.toLowerCase())
        ) {
          navigateToPDFPage(override.page)
        }
      })

      // Update quick replies with the options
      setQuickReplies(updatedOptions)
      updateConversationHistory("assistant", formattedResponse)
    } catch (error) {
      console.error("Error in handling send:", error)
      replaceBotMessageWithError(
        setMessages,
        "There was an error processing your request. Please try again."
      )
      updateConversationHistory(
        "assistant",
        "There was an error processing your request. Please try again."
      )
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
      handleSend("Thank you for using the Washing Machine Assistant. Goodbye!")
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
        />
      )}
    </div>
  )
}

export default ChatOpenAI
