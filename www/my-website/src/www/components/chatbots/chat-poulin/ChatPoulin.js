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
import { Bar, Line } from "react-chartjs-2"

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
}) => {
  const [inputValue, setInputValue] = useState("")
  const [, setVoiceMessage] = useState(null)
  const [isVoiceInput, setIsVoiceInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [, setIsCustomInput] = useState(false)

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

  // Dati statici per i grafici
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Spese settimanali ($)",
        data: [10, 20, 15, 30, 25, 10, 5],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  }

  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Spese mensili ($)",
        data: [300, 250, 400, 450, 500, 350, 600, 700, 500, 400, 300, 450],
        backgroundColor: "rgba(153,102,255,0.6)",
        borderColor: "rgba(153,102,255,1)",
        borderWidth: 1,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="chat-poulin">
      <div className="chat-poulin-main">
        <MessageList messages={messages} IsReturnTable={true} />
        <div ref={messagesEndRef} />

        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          handleSend={handleSend}
          isMenuVisible={false}
          handleQuickReply={handleQuickReply}
          onClickMicro={handleMicrophoneClick}
        />
      </div>
      <div className="chat-poulin-right" style={{ height: "500px" }}>
        <div className="title-usage">Usage</div>
        <br />
        Weekly usage:
        <br />
        <Line data={lineData} options={lineOptions} />
        <br />
        Monthly usage:
        <Bar
          data={barData}
          options={barOptions}
          style={{ marginTop: "20px" }}
        />
      </div>
    </div>
  )
}

export default ChatPoulin
