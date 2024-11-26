import React, { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import ChatInput from "../components/chatinput/ChatInput"
import MessageList from "../components/messagelist/MessageList"
import QuickReplies from "../components/quickreplies/QuickReplies"
import "./ChatBroker.css"
import { addBotLoadingMessage, replaceBotMessageWithError } from "./utils"
import { generateResponseWithContext, initializeData } from "./utils_api"

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

  // Funzione per elaborare i documenti
  const processDocuments = (value, output) => {
    output += `\nDocumentos\n`
    output += `-------------------------------\n`
    const maxDocKeyLength = Math.max(...value.map((doc) => doc.name.length))
    value.forEach((doc) => {
      output += `${doc.name.padEnd(maxDocKeyLength + 2)}: ${doc.status}\n`
    })
    return output // Restituisci l'output aggiornato
  }

  // Funzione per elaborare le note
  const processNotes = (value, output) => {
    output += `\nNotes\n`
    output += `-------------------------------\n`
    const maxNoteKeyLength = Math.max(...value.map((note) => note.text.length))
    value.forEach((note) => {
      output += `${note.text.padEnd(maxNoteKeyLength + 2)}\n`
    })
    return output // Restituisci l'output aggiornato
  }

  function jsonToAscii(json) {
    let output = "Informacion cliente\n"
    output += "-------------------------------\n"
    const maxKeyLength = Math.max(...Object.keys(json).map((key) => key.length))

    for (const [key, value] of Object.entries(json)) {
      if (key === "documents" && Array.isArray(value)) {
        output = processDocuments(value, output) // Passa output come argomento
        continue
      }

      if (key === "note" && Array.isArray(value)) {
        output = processNotes(value, output) // Passa output come argomento
        continue
      }

      if (Array.isArray(value)) {
        // Skip printing the array directly for other keys
        output += `${key.padEnd(maxKeyLength + 2)}: [Array of ${
          value.length
        } items]\n`
        continue
      }

      const displayValue = value === null ? "N/A" : value.toString()
      output += `${key.padEnd(maxKeyLength + 2)}: ${displayValue.padEnd(20)}\n`
    }

    return output
  }

  const apiUrl = window.location.hostname === "localhost" ? local : server

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
        const data = await initializeData(apiUrl, systemPrompt, filename, model)
        console.log("Initial data loaded:", data)

        setConversationHistory((prev) => [
          {
            role: "system",
            content: `data: ${JSON.stringify(data)}`,
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

      // Supponendo che botResponse sia il tuo JSON
      console.log(botResponse)
      let asciiResponse
      try {
        asciiResponse = jsonToAscii(JSON.parse(botResponse))
      } catch {
        asciiResponse = botResponse // Leave the response as is if it's not valid JSON
      }

      // Asegúrate que cleanedResponse sea una cadena HTML
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: uuidv4(),
          sender: "bot",
          text: asciiResponse,
        })
      )

      // set voice message
      setVoiceMessage(botResponse.replace(/<[^>]+>/g, ""))

      setConversationHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: botResponse },
      ])

      // totale aggiornato
      checkAndUpdateTotal(botResponse)
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
    <div className="chat-openai">
      {ispay && <h1 className="total">{total.toFixed(2)} $</h1>}
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
