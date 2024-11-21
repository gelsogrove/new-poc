import React, { useState } from "react"
import "./ChatInput.css"

const ChatInput = ({
  inputValue,
  setInputValue,
  isLoading,
  handleSend,
  handleQuickReply,
}) => {
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [, setTranscript] = useState("")

  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)()
    recognition.lang = "en-US" // Imposta la lingua (cambia in 'it-IT' se necessario)
    recognition.interimResults = false

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript // Ottieni il testo trascritto

      console.log("Trascrizione:", result) // Log della trascrizione
      handleSend(result) // Aggiorna il campo di input con la trascrizione
    }

    recognition.onerror = (event) => {
      console.error("Errore di riconoscimento:", event.error)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
    setIsRecording(true)
  }

  const stopListening = () => {
    setIsRecording(false)
    // Non è necessario fermare il riconoscimento qui, poiché gestiamo l'evento onend
  }

  const handleMicroClick = () => {
    if (isRecording) {
      stopListening()
    } else {
      startListening()
      setCountdown(8)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            stopListening()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const handleSendClick = () => {
    console.log("Testo dell'utente:", inputValue)
    handleSend(inputValue)
    setTranscript("")
    setInputValue("")
  }

  return (
    <div className="chat-input input-group">
      <input
        type="text"
        className="form-control input-wide"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <div className="input-group-append">
        <button
          className="btn btn-primary"
          onClick={handleSendClick}
          disabled={isLoading}
        >
          Send
        </button>
        <div style={{ marginLeft: "8px" }}>
          <button
            className="btn btn-primary btn-wide"
            onClick={handleMicroClick}
            disabled={isLoading}
          >
            {isRecording ? (
              <span>
                <span className="recording-icon" style={{ color: "red" }}>
                  ●
                </span>
                {countdown}
              </span>
            ) : (
              "Micro"
            )}
          </button>
        </div>
        <button
          className="btn btn-primary btn-wide btn-menu"
          onClick={() => handleQuickReply("Menu")}
        >
          Menu
        </button>
      </div>
    </div>
  )
}

export default ChatInput
