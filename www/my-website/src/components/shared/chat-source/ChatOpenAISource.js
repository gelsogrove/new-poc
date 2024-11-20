import React, { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import "./ChatOpenAISource.css"
import ChatInput from "./components/chatinput/ChatInput"
import MessageListSource from "./components/messagelistSource/MessageListSource"
import { addBotLoadingMessage, replaceBotMessageWithError } from "./utils"
import { generateResponseWithContext, initializeData } from "./utils_api"

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
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])

  // Stato per i dati iniziali
  const [initialData, setInitialData] = useState("")

  useEffect(() => {
    initializeData()
      .then((data) => {
        console.log("Initial data loaded:", data)
        debugger
        setInitialData(data.data) // Memorizza i dati iniziali
        setConversationHistory((prev) => [
          {
            role: "system",
            content: `Ecco i dati iniziali: ${JSON.stringify(data.customers)}`,
          },
          ...prev,
        ])
      })
      .catch((error) => {
        console.error("Error loading initial data:", error)
      })
  }, [])

  const handleSend = async (message) => {
    if (typeof message !== "string" || !message.trim()) return

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

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: botResponse,
        })
      )

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: botResponse },
      ])
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

  return (
    <div className="chat-openai">
      <h3>Chatbot customer order example...</h3>

      <MessageListSource messages={messages} />

      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        handleSend={handleSend}
      />
    </div>
  )
}

export default ChatOpenAISource
