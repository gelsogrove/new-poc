// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import ChatOpenAI from "../../shared/chat-embed/ChatOpenAI" // Componente per la chat
import { getCookie, navigateToPDFPage } from "../../shared/chat-embed/utils"
import "./ChatbotPopup.css"

const ChatbotPopup = ({ onClose }) => {
  const handleNavigateToPage = (pageNumber) => navigateToPDFPage(pageNumber)

  // Crea l'oggetto config
  const config = {
    title: "Washing Machine ChatBot",
    systemPrompt:
      'You are a washing machine technician. Answer the question using simple English, keeping the response under 230 tokens. Include maximum 4 possible related questions that the user might ask to continue the conversation. Underliene the key word of the concept like that: add \'**\' and put in uppercase example: warning, will became **WARNING**, maximum one word for content. Please don\'t add the page information on the text. If the answer involves steps or a list, format them as HTML list items (<li>item</li>). Format the response in JSON as follows: { page: "page number", "response": "Response text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"],}',

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
    temperature: 0.6,
    model: "gpt-4o-mini",
  }

  let language = getCookie("selectedLanguage")
  if (language === "it") {
    config.first_message =
      "Ciao! Questo è un esempio. Abbiamo caricato il manuale della lavatrice. Non esitare a chiedere qualsiasi domanda relativa alle lavatrici."
    config.first_options = [
      "Come posso collegarmi all'acqua?",
      "Qual è la garanzia che non copre?",
      "Ho un'emergenza",
      "Come posso impostare un ciclo di lavaggio a mano?",
      "Altro",
      "Esci",
    ]
    config.goodbye_message =
      "Grazie per aver utilizzato l'Assistente per la Lavatrice. Arrivederci!"
    config.error_message =
      "Si è verificato un errore durante il processamento della tua richiesta. Per favore, riprova."
  }

  if (language === "es") {
    config.first_message =
      "¡Hola! Este es un ejemplo. Hemos cargado el manual de la lavadora. No dudes en preguntar cualquier pregunta relacionada con las lavadoras."
    config.first_options = [
      "¿Cómo puedo conectarme a la fuente de agua?",
      "¿Cuál es la garantía que no cubre?",
      "Tengo un emergencia",
      "¿Cómo puedo configurar un ciclo de lavado a mano?",
      "Otro",
      "Salir",
    ]
    config.goodbye_message =
      "¡Gracias por usar el Asistente para la Lavadora. ¡Adiós!"
    config.error_message =
      "Se ha producido un error durante el procesamiento de su solicitud. Por favor, inténtelo de nuevo."
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
