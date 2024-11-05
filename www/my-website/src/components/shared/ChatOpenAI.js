import "bootstrap/dist/css/bootstrap.min.css"
import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"
import { formatText, generateResponseWithContext } from "./utils"

// Definisco il messaggio iniziale come costante
const INITIAL_BOT_MESSAGE = {
  id: crypto.randomUUID(),
  sender: "bot",
  text: "Hello! Feel free to ask any questions related to washing machines.",
}

const ChatOpenAI = () => {
  const [inputValue, setInputValue] = useState("")
  const [embeddingData, setEmbeddingData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomInput, setIsCustomInput] = useState(false) // Stato per gestire l'input manuale
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]) // Usa il messaggio iniziale
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: "assistant",
      content: INITIAL_BOT_MESSAGE.text, // Usa il testo del messaggio iniziale
    },
  ])
  const [showMainMenu, setShowMainMenu] = useState(true) // Stato per mostrare il menu principale
  const [hasExited, setHasExited] = useState(false)
  const [quickReplies, setQuickReplies] = useState([
    "My washing machine is leaking.",
    "The display shows a red light.",
    "How do I change the filter?",
    "Give me the safety instructions.",
    "Other",
    "Exit",
  ]) // Opzioni predefinite iniziali

  // Carica i dati di embedding dal server
  useEffect(() => {
    const loadEmbeddingData = async () => {
      try {
        const response = await fetch("/embedding/washing-machine-001.json")
        if (!response.ok) throw new Error("Failed to load embedding data")
        const data = await response.json()
        setEmbeddingData(data)
      } catch (error) {
        console.error("Embedding loading error:", error)
      }
    }
    loadEmbeddingData()
  }, [])

  // Funzione per aggiornare lo storico della conversazione
  const updateConversationHistory = (role, content) => {
    setConversationHistory((prevHistory) => [...prevHistory, { role, content }])
  }

  // Funzione per gestire l'invio del messaggio
  const handleSend = async (message = inputValue) => {
    if (typeof message !== "string") return
    if (!message.trim()) return

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    updateConversationHistory("user", message)
    setInputValue("")
    setIsLoading(true)

    const loadingMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Generating a response for you...",
    }
    setMessages((prevMessages) => [...prevMessages, loadingMessage])

    try {
      // Ottieni la risposta e le opzioni dal modello
      const botResponse = await generateResponseWithContext(
        null, // Se non usiamo embedding possiamo passare null qui
        message,
        conversationHistory,
        process.env.REACT_APP_OPENAI_API_KEY
      )

      // Imposta il messaggio del bot e le nuove opzioni di risposta
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: formatText(botResponse.response),
        })
      )

      // Aggiungi sempre "Other" e "Exit" alle opzioni dinamiche restituite dall'API
      const updatedOptions = [...botResponse.options, "Other", "Exit"]
      setQuickReplies(updatedOptions) // Aggiorna le opzioni di risposta dinamiche
      updateConversationHistory("assistant", botResponse.response)
      setShowMainMenu(true) // Riporta i bottoni di risposta rapida
      setIsCustomInput(false) // Nasconde l'input manuale
    } catch (error) {
      console.error("Error in handling send:", error)
      const errorMessage =
        "There was an error processing your request. Please try again."
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: errorMessage,
        })
      )
      updateConversationHistory("assistant", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Funzione per gestire la selezione dei bottoni predefiniti
  const handleQuickReply = (text) => {
    if (text === "Other") {
      setIsCustomInput(true) // Mostra il campo di input manuale
      setShowMainMenu(false) // Nasconde i bottoni fino al prossimo invio
    } else if (text === "Exit") {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          sender: "bot",
          text: "Thank you for using the Washing Machine Assistant. Goodbye!",
        },
      ])
      setHasExited(true) // Imposta l'uscita dalla chat
    } else {
      setInputValue(text)
      handleSend(text) // Invia automaticamente la domanda
    }
  }

  return (
    <div className="chat-openai">
      <h3>Chatbot Washing Machine Assistant</h3>

      {/* Sezione dei messaggi della chat */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <span className="message-text">
              {msg.sender === "bot" ? formatText(msg.text) : msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Sezione dei bottoni predefiniti */}
      {!isCustomInput && showMainMenu && !isLoading && !hasExited && (
        <div className="quick-reply-buttons d-flex flex-wrap">
          {quickReplies.map((reply, index) => (
            <div key={index} className="col-6 mb-2">
              <button
                className="btn btn-primary btn-wide"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sezione di input manuale */}
      {isCustomInput && !hasExited && (
        <div className="chat-input input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              onClick={() => handleSend()}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatOpenAI
