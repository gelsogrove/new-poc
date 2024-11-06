// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import ChatOpenAI from "../../shared/ChatOpenAI" // Componente per la chat
import "./ChatbotPopup.css"

const ChatbotPopup = ({ onClose }) => {
  const handleNavigateToPage = (pageNumber) => {
    const pdfViewer = document.getElementById("pdfViewer")
    if (pdfViewer) {
      // Forza il caricamento della nuova pagina
      pdfViewer.src = "" // Temporaneamente svuota l'iframe
      setTimeout(() => {
        pdfViewer.src = `http://localhost:3000/embedding/washing-machine-001.pdf#page=${pageNumber}`
        console.log(`Page IFRAME: ${pdfViewer.src}`) // Log per il debug
      }, 500) // Aggiungi un piccolo ritardo prima di ripristinare l'URL
    } else {
      console.error("PDF viewer not found!")
    }
  }

  return (
    <div className="chatbot-popup">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      {/* Sezione PDF */}
      <div className="pdf-section">
        <iframe
          id="pdfViewer"
          src="/embedding/washing-machine-001.pdf"
          width="100%"
          height="600"
          title="PDF Viewer"
        ></iframe>
      </div>

      {/* Sezione Chat */}
      <div className="chat-section">
        <ChatOpenAI onNavigateToPage={handleNavigateToPage} />
      </div>
    </div>
  )
}

export default ChatbotPopup
