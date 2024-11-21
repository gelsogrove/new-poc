import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"
import {
  addBotLoadingMessage,
  cleanText,
  findBestMatchInEmbeddings,
  formatBoldText,
  formatText,
  getCookie,
  loadEmbeddingData,
  navigateToPDFPage,
  replaceBotMessageWithError,
} from "./utils"

import {
  convertQuestionToEmbedding,
  generateResponseWithContext,
  generateSpeech,
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
    if (isVoiceInput) {
      setIsVoiceInput(false)
      generateSpeech(voiceMessage)
      console.log("run voice", voiceMessage)
    }
  }, [voiceMessage])

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
      const questionEmbedding = await convertQuestionToEmbedding(message, model)
      const bestMatch = findBestMatchInEmbeddings(
        embeddingData,
        questionEmbedding
      )
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
      // end loading
      setIsLoading(false)

      // Format response
      const { formattedResponse, options, page } = formatText(botResponse)
      let cleanedResponse = cleanText(formattedResponse)
      cleanedResponse = formatBoldText(cleanedResponse)
      setChatbotResponse(cleanedResponse)

      // Navigate to PDF page
      if (page) {
        navigateToPDFPage(page)
      }

      // Set Messages
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: cleanedResponse,
        })
      )

      // set quick replies
      let language = getCookie("selectedLanguage")
      if (language === "es") {
        setQuickReplies([...options, "Otro", "Menú"])
      }
      if (language === "it") {
        setQuickReplies([...options, "Altro", "Menu"])
      }
      if (language === "en") {
        setQuickReplies([...options, "Other", "Menu"])
      }

      // update conversation history
      updateConversationHistory("assistant", botResponse)

      // set voice message
      setVoiceMessage(cleanedResponse.replace(/<[^>]+>/g, ""))
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
    let language = getCookie("selectedLanguage")
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
    setIsVoiceInput(true)
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
          onClickMicro={handleMicrophoneClick}
        />
      )}
    </div>
  )
}

export default ChatOpenAI
