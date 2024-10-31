// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import ChatOpenAI from "../../shared/ChatOpenAI" // Componente per la chat
import "./ChatbotPopup.css"

const ChatbotPopup = ({ onClose }) => {
  const pdfUrl =
    "https://d15v10x8t3bz3x.cloudfront.net/Libretti/2021/4/16178799/Haier%20UM%20HW80-B14979-HW100-B14979-HW120-B14979%20EN%20IT.pdf"

  return (
    <div className="chatbot-popup">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      {/* Sezione PDF */}
      <div className="pdf-section">
        <iframe
          src={pdfUrl}
          width="100%"
          height="600"
          title="PDF Viewer"
        ></iframe>
      </div>

      {/* Sezione Chat */}
      <div className="chat-section">
        <ChatOpenAI type="custom-chatbot" />
      </div>
    </div>
  )
}

export default ChatbotPopup
