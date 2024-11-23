import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import "./ChatOpenAISource.css"
import ChatInput from "./components/chatinput/ChatInput"
import MessageListSource from "./components/messagelistSource/MessageListSource"
import QuickReplies from "./components/quickreplies/QuickReplies"
import {
  addBotLoadingMessage,
  cleanText,
  formatBoldText,
  formatText,
  replaceBotMessageWithError,
} from "./utils"
import { generateResponseWithContext, initializeData } from "./utils_api"

const ChatOpenAISource = ({
  first_message,
  first_options,
  systemPrompt,
  max_tokens,
  temperature,
  model,
  error_message,
  goodbye_message,
  ispay,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [, setVoiceMessage] = useState(null)
  const [, setIsVoiceInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInput, setIsCustomInput] = useState(false)
  const [total, setTotal] = useState(0)
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])
  const [quickReplies, setQuickReplies] = useState(first_options)

  // Stato per i dati iniziali
  const [, setInitialData] = useState("")

  // Funzione per controllare e aggiornare il totale
  const checkAndUpdateTotal = (cleanedResponse) => {
    if (
      cleanedResponse.includes("total") ||
      cleanedResponse.includes("summary") ||
      cleanedResponse.includes("table-header")
    ) {
      setTotal((prevTotal) => prevTotal + 0.2) // Aggiungi 20 centesimi
    }
  }

  const handleSend = async (message) => {
    if (typeof message !== "string" || !message.trim()) return

    // Inizializza i dati solo alla prima richiesta
    if (conversationHistory.length === 1) {
      try {
        const data = await initializeData()
        console.log("Initial data loaded:", data)

        setInitialData(data.data) // Memorizza i dati iniziali
        setConversationHistory((prev) => [
          {
            role: "system",
            content: `data: ${JSON.stringify(data.customers)}`,
          },
          ...prev,
        ])
      } catch (error) {
        console.error("Error loading initial data:", error)
      }
    }

    const userMessage = {
      id: uuidv4(),
      sender: "user",
      text: message,
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputValue("")
    setIsLoading(true)

    addBotLoadingMessage(setMessages)

    try {
      const botResponse = await generateResponseWithContext(
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

      // Assicurati che cleanedResponse sia una stringa HTML
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: <div dangerouslySetInnerHTML={{ __html: cleanedResponse }} />, // Renderizza HTML
        })
      )

      // set voice message
      setVoiceMessage(cleanedResponse.replace(/<[^>]+>/g, ""))

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: botResponse },
      ])

      // totale aggiornato
      checkAndUpdateTotal(cleanedResponse)
    } catch (error) {
      console.error("Error in handling send:", error)
      replaceBotMessageWithError(setMessages, error_message)
      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: error_message },
      ])
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
    } else if (text === "Exit") {
      handleSend(goodbye_message)
      setIsCustomInput(true)
    } else {
      setInputValue(text)
      handleSend(text)
      setIsCustomInput(true)
    }
  }

  const handleMicrophoneClick = () => {
    setIsVoiceInput(true)
  }

  return (
    <div className="chat-openai">
      {ispay && <h1 className="total">{total.toFixed(2)} $</h1>}
      <MessageListSource messages={messages} />

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
          onClickMicro={handleMicrophoneClick}
        />
      )}
    </div>
  )
}

export default ChatOpenAISource
