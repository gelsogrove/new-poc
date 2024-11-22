import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"
import {
  addBotLoadingMessage,
  findBestMatchInEmbeddings,
  formatBotResponse,
  getCookie,
  loadEmbeddingData,
  navigateToPDFPage,
  replaceBotMessageWithError,
} from "./utils"

import {
  convertQuestionToEmbedding,
  generateResponseWithContext,
  generateSpeech,
  stopSpeech,
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
  const [total, setTotal] = useState(0)
  const [isVoiceInput, setIsVoiceInput] = useState(false)
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])
  const [quickReplies, setQuickReplies] = useState(first_options)
  const [embeddingData, setEmbeddingData] = useState(null)
  const [chatbotResponse, setChatbotResponse] = useState(null)
  const [voiceMessage, setVoiceMessage] = useState(null)
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
    if (isVoiceInput && voiceMessage) {
      setIsVoiceInput(false)
      generateSpeech(voiceMessage)
      setTotal((prevTotal) => prevTotal + 0.05)
      console.log("run voice", voiceMessage)
    }
  }, [voiceMessage, isVoiceInput])

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

    addBotLoadingMessage(setMessages)

    try {
      // Match
      const bestMatch = await findBestMatch(message)

      setIsLoading(true)
      const botResponse = await generateResponseWithContext(
        bestMatch,
        message,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model
      )
      setIsLoading(false)

      // Format response using the new function
      const { cleanedResponse, options, page } = formatBotResponse(botResponse)

      // update conversation history
      updateConversationHistory("assistant", botResponse)

      // set chatbot response
      setChatbotResponse(cleanedResponse)

      // Navigate to PDF page
      navigateToPage(page)

      // Set Messages server per la chat
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: cleanedResponse,
        })
      )

      const nohtmlresponse = cleanedResponse.replace(/<[^>]+>/g, "")
      // set voice message
      setVoiceMessage(nohtmlresponse)

      // set quick replies
      setLanguageOptions(options)

      setTotal((prevTotal) => prevTotal + 0.1)
    } catch (error) {
      console.error("Error in handling send:", error)
      replaceBotMessageWithError(setMessages, error_message)
      updateConversationHistory("assistant", error_message)
    } finally {
      setIsLoading(false)
    }
  }

  // Quick Replies
  const handleQuickReply = (text) => {
    if (text === "Altro") {
      text = "Other"
    }
    if (text === "Otro") {
      text = "Other"
    }
    if (text === "Salir") {
      text = "Exit"
    }
    if (text === "Esci") {
      text = "Exit"
    }

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

  // Microphone boolean
  const handleMicrophoneClick = () => {
    stopSpeech()
    setVoiceMessage(null)
    setIsVoiceInput(true)
  }

  const navigateToPage = (page) => {
    if (page) {
      navigateToPDFPage(page)
    }
  }

  const setLanguageOptions = (options) => {
    let language = getCookie("selectedLanguage")
    const languageOptions = {
      es: [...options, "Otro", "Menú"],
      it: [...options, "Altro", "Menu"],
      en: [...options, "Other", "Menu"],
    }
    setQuickReplies(languageOptions[language] || options) // Default to options if language not found
  }

  const findBestMatch = async (message) => {
    const questionEmbedding = await convertQuestionToEmbedding(message, model)
    return findBestMatchInEmbeddings(embeddingData, questionEmbedding)
  }

  return (
    <div className="chat-openai">
      <h3>{title}</h3>

      <h1 className="total">{total.toFixed(2)} $</h1>

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
          onClickMicro={handleMicrophoneClick}
        />
      )}
    </div>
  )
}

export default ChatOpenAI
