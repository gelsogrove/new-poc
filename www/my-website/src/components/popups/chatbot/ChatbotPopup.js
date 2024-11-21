// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import ChatOpenAI from "../../shared/chat-embed/ChatOpenAI" // Componente per la chat
import { navigateToPDFPage } from "../../shared/chat-embed/utils"
import "./ChatbotPopup.css"

const ChatbotPopup = ({ onClose }) => {
  const handleNavigateToPage = (pageNumber) => navigateToPDFPage(pageNumber)

  // Crea l'oggetto config
  const config = {
    title: "Washing Machine ChatBot",
    systemPrompt:
      'You are a washing machine technician. Answer the question using simple English, keeping the response under 230 tokens. Include maximum 4 possible related questions that the user might ask to continue the conversation. Underliene the key word of the concept like that: add \'**\' and put in uppercase example: warning, will became **WARNING**, maximum one word for content. Please don\'t add the page information on the text. If the answer involves steps or a list, format them as HTML list items (<li>item</li>). Format the response in JSON as follows: { "response": "Response text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"],}',

    embedding: "/embedding/washing-machine-001.json",
    first_message:
      "Hello! This is an example. We have loaded the washing machine manual. Feel free to ask any questions related to washing machines.",
    first_options: [
      "How can I connect to the water?",
      "What warranty does not cover?",
      "I have an emergency",
      "How can i set a hand wash cycle?",
      "Other",
      "Exit",
    ],
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message:
      "Thank you for using the Washing Machine Assistant. Goodbye!",
    max_tokens: 300,
    temperature: 0.7,
    model: "gpt-4o-mini",
    overrides: [
      { word: "Washing programs", page: 16 },
      { word: "Hand Wash", page: 18 },
      { word: "Water Supply", page: 27 },
      { word: "Cleaning", page: 32 },
      { word: "Maintainance", page: 32 },
      { word: "Wasshing program", page: 34 },
      { word: "Troubleshooting", page: 35 },
      { word: "Warranty", page: 36 },
      { word: "Weight", page: 37 },
      { word: "Eco", page: 19 },
      { word: "Soak", page: 21 },
      { word: "Custom Program", page: 24 },
      { word: "Spin", page: 20 },
      { word: "Detergent", page: 12 },
      { word: "Additives", page: 12 },
      { word: "Warning", page: 11 },
      { word: "Warnings", page: 11 },
      { word: "Before Washing", page: 9 },
      { word: "Additives", page: 10 },
      { word: "Caution", page: 5 },
      { word: "Button", page: 14 },
      { word: "Ground", page: 31 },
      { word: "Drain Hose", page: 30 },
      { word: "Functions", page: 25 },
      { word: "Wash capacity", page: 37 },
      { word: "Caution", page: 31 },
      { word: "Troubleshooting", page: 35 },
      { word: "Wash capacity", page: 37 },
      { word: "Laundry capacity", page: 37 },
      { word: "CAPACITY of the washing machine", page: 37 },
      { word: "CAPACITY of the laundry machine", page: 37 },
    ],
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
          src="https://ai-ag.dairy-tools.com/washingmachine/washing-machine-001.pdf"
          width="100%"
          height="600"
          title="PDF Viewer"
        ></iframe>
      </div>

      {/* Sezione Chat */}
      <div className="chat-section">
        <ChatOpenAI {...config} onNavigateToPage={handleNavigateToPage} />
      </div>
    </div>
  )
}

export default ChatbotPopup
