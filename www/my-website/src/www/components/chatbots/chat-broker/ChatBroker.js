import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatInput from "../shared/chatinput/ChatInput"
import MessageList from "../shared/messagelist/MessageList"
import QuickReplies from "../shared/quickreplies/QuickReplies"
import "./ChatBroker.css"
import { addBotLoadingMessage, replaceBotMessageWithError } from "./utils"
import { generateResponseWithContext } from "./utils_api"

const ChatbotBroker = ({
  first_message,
  first_options,
  systemPrompt,
  max_tokens,
  temperature,
  model,
  error_message,
  goodbye_message,
  ispay,
  filename,
  server,
  local,
}) => {
  const [inputValue, setInputValue] = useState("")
  //const [, setVoiceMessage] = useState(null)
  const [, setIsVoiceInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInput, setIsCustomInput] = useState(true)
  //const [total, setTotal] = useState(0)
  const [messages, setMessages] = useState([
    { id: uuidv4(), sender: "bot", text: first_message },
  ])
  const [conversationHistory, setConversationHistory] = useState([
    { role: "assistant", content: first_message },
  ])
  const [quickReplies, setQuickReplies] = useState(first_options)

  const apiUrl = window.location.hostname === "localhost" ? local : server

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
        apiUrl,
        message,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model
      )

      // Supponendo che botResponse sia il tuo JSON
      console.log(botResponse)

      // Asegúrate que cleanedResponse sea una cadena HTML
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: botResponse.message,
        })
      )

      // set voice message
      //setVoiceMessage(botResponse.replace(/<[^>]+>/g, ""))

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: botResponse.message },
      ])

      // totale aggiornato
      //checkAndUpdateTotal(botResponse)
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
    if (text === "Other" || text === "Otro") {
      setIsCustomInput(true)
    } else if (text === "Menu") {
      setQuickReplies(first_options)
      setIsCustomInput(false)
    } else if (text === "Exit" || text === "Guardar y Salir") {
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
    <div className="chat-broker">
      {ispay && <h1 className="total">0.00 $</h1>}
      <MessageList messages={messages} IsReturnTable={true} />

      {!isCustomInput && (
        <>
          <QuickReplies
            quickReplies={quickReplies}
            handleQuickReply={handleQuickReply}
          />
        </>
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

export default ChatbotBroker
