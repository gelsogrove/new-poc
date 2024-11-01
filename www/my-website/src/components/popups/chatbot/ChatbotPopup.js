// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import ChatOpenAI from "../../shared/ChatOpenAI" // Componente per la chat
import "./ChatbotPopup.css"

const ChatbotPopup = ({ onClose }) => {
  return (
    <div className="chatbot-popup">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      {/* Sezione PDF */}
      <div className="pdf-section">
        <iframe
          src="http://localhost:3000/embedding/washing-machine-001.pdf"
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
