import React, { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatInput from "../shared/chatinput/ChatInput"
import MessageList from "../shared/messagelist/MessageList"
import "./ChatPoulin.css"
import {
  addBotLoadingMessage,
  cleanText,
  formatBoldText,
  formatText,
  getCookie,
  replaceBotMessageWithError,
} from "./utils"
import { generateResponseWithContext, initializeData } from "./utils_api"

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"

import Usage from "./usage/Usage.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ChatPoulin = ({
  first_message,
  first_options,
  max_tokens,
  temperature,
  model,
  error_message,
  goodbye_message,
  ispay,
  filename,
  systemPrompt,
  local,
  server,
  openPanel,
}) => {
  const [inputValue, setInputValue] = useState("")
  const [, setVoiceMessage] = useState(null)
  const [isVoiceInput, setIsVoiceInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])
  const [, setQuickReplies] = useState(first_options)

  const messagesEndRef = useRef(null)

  const apiUrl = window.location.hostname === "localhost" ? local : server

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (message) => {
    if (typeof message !== "string" || !message.trim()) return

    if (conversationHistory.length === 1) {
      try {
        const data = await initializeData(apiUrl, systemPrompt, filename, model)
        console.log("Initial data loaded:", data)

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
        apiUrl,
        message,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model
      )

      const { formattedResponse, options } = formatText(botResponse)
      let cleanedResponse = cleanText(formattedResponse)
      cleanedResponse = formatBoldText(cleanedResponse)

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: <div dangerouslySetInnerHTML={{ __html: cleanedResponse }} />,
        })
      )

      setVoiceMessage(cleanedResponse.replace(/<[^>]+>/g, ""))

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: botResponse },
      ])

      setLanguageOptions(options)
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

  const setLanguageOptions = (options) => {
    let language = getCookie("selectedLanguage") || "en"
    const languageOptions = {
      es: [...options, "Otro", "Menú"],
      it: [...options, "Altro", "Menu"],
      en: [...options, "Other", "Menu"],
    }
    setQuickReplies(languageOptions[language] || options)
  }

  const handleMicrophoneClick = () => {
    setIsVoiceInput((prev) => !prev)
    console.log(isVoiceInput ? "Microfono disattivato" : "Microfono attivato")
  }

  return (
    <div className="chat-poulin">
      <br />
      <div className="chat-poulin-main">
        <div className="chat-poulin-main-messages">
          <MessageList messages={messages} IsReturnTable={true} />
          <div ref={messagesEndRef} />
        </div>
        <div>
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            handleSend={handleSend}
            isMenuVisible={false}
            onClickMicro={handleMicrophoneClick}
          />
        </div>
      </div>
      <div
        className="chat-poulin-right"
        style={{
          width: openPanel ? "30%" : "0%",
          transition: "width 0.3s ease",
          padding: openPanel ? "20px" : "0px",
        }}
      >
        {openPanel && <Usage />}
      </div>
    </div>
  )
}

export default ChatPoulin
