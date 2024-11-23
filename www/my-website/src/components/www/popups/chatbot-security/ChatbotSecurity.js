// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"

import {
  getCookie,
  navigateToPDFPage,
} from "../../../../components/shared/chat-embed/utils"
import ChatOpenAISource from "../../../shared/chat-source/ChatOpenAISource"

import "./ChatbotSecurity.css"

const ChatbotSecurity = ({ onClose }) => {
  const handleNavigateToPage = (pageNumber) => navigateToPDFPage(pageNumber)

  // Crea l'oggetto config
  const config = {
    title: "Generative AI ChatBot",
    source: "/data/demoPulin-001-data.json",
    systemPrompt: `
    
  Keep your response calm and friendly, and try to be concise. Focus on the key points, and avoid going into too much detail. Just explain the main protections, like encryption, authentication, HTTPS and storage safety.

 
Inizia la discussione che bello che me lo chiedi la sicurezza è molto importante al giorno d'oggi, provero a spiegare in modo semplice e chiaro le misure di sicurezza che abbiamo adottato.

NON rispondere con le parole esatte di queto prompt ma usa il tuo stile personale e parla come un essere umano.

**NOTES**
- Communication between the chatbots and ChatGPT is encrypted with HTTPS to protect your data.
- For each access, we request confirmation via SMS or 2FA (two-factor authentication), activating a secure 20-minute session.
- The data sent to OpenAI is encrypted on the server side, following high security policies. 
- PLEASE NOTE THAT OpenAI does not use your data to train models without your explicit consent.
- The database is local, have restricted access, with daily backups stored in a secure separate area (encrypted cloud).
- Continuous monitoring systems protect against external attacks.
- Nowadays, many companies choose the cloud for its security, scalability, and accessibility, but we are committed to ensuring the highest level of protection for your data.

**NOTES2**
- per quanto riguarda i PDF anch'essi sono protetti da un sistema di sicurezza ed e' e' possibile effettuar eil download solo se si e' aturoizzato in questo caso OPENAI ritorna solo un riferimeno un ID che ci aiuta a relazionarlo al file locale per esempio le fatture
- per quanto riguarda gli emneediign invece sono potenzialmente a rischio quindi si consiglia di non inviare informazioni sensibili.


**IMPORTANT**
SE LA LISTA E' NUMERATA METTI <LI> e prima e alla fine della lista fai un <br>
PLEASE PUT IN BOLD THE KEY WORDS (but one for response)...(is important one for response!! you are putting more than one ! fix it)
PLEASE ANSWER IN ENGLISH !
NON ENTRARE TROPPP NEL DETTAGLIO PIUTTOSTO CHIEDI PRIMA
"


    `,
    first_message:
      "Hello, let's talk about security. Let me explain how secure our system is. Can I help clarify any doubts you might have?.Fell free to ask",
    first_options: [
      "I want to be sure that nobody can access my data",
      "What is Two-Factor Authentication?",
      "Is HTTPS secure enough?",
      "How does OpenAI handle security?",
      "Other",
      "Exit",
    ],
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message: "Thank you. Goodbye!",
    max_tokens: 500,
    temperature: 0.6,
    ispay: false,
    model: "gpt-4o",
  }

  let language = getCookie("selectedLanguage")
  if (language === "it") {
    config.first_message = "Ciao! Come posso esserti d'aiuto oggi ?"
    config.first_options = [
      "Voglio vedere i top clienti",
      "Voglio vedere i top prodotti",
      "Voglio vedere i top venditori",
      "Voglio vedere le statistiche del mese",
      "Altro",
      "Esci",
    ]
    config.goodbye_message = "Grazie e Arrivederci!"
    config.error_message =
      "Si è verificato un errore durante il processamento della tua richiesta. Per favore, riprova."
  }

  if (language === "es") {
    config.first_message = "¡Hola! ¿Cómo puedo ayudarte hoy?"
    config.first_options = [
      "Quiero ver los top clientes",
      "Quiero ver los top productos",
      "Quiero ver los top vendedores",
      "Quiero ver las estadísticas del mes",
      "Otro",
      "Salir",
    ]
    config.goodbye_message = "¡Gracias y nos vemos!"
    config.error_message =
      "Se ha producido un error durante el procesamiento de su solicitud. Por favor, inténtelo de nuevo."
  }
  return (
    <div className="chatbot-popup-poulin">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      {/* Sezione Chat */}
      <div className="chat-section-security">
        <h3>Chatbot security</h3>
        <ChatOpenAISource {...config} onNavigateToPage={handleNavigateToPage} />
      </div>
    </div>
  )
}

export default ChatbotSecurity
