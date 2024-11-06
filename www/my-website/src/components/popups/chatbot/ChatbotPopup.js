// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import ChatOpenAI from "../../shared/ChatOpenAI" // Componente per la chat
import { navigateToPDFPage } from "../../shared/utils"
import "./ChatbotPopup.css"

const ChatbotPopup = ({ onClose }) => {
  const handleNavigateToPage = (pageNumber) => navigateToPDFPage(pageNumber)

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
