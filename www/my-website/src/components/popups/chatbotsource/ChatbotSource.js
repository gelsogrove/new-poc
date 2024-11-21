// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"

import { getCookie, navigateToPDFPage } from "../../shared/chat-embed/utils"
import ChatOpenAISource from "../../shared/chat-source/ChatOpenAISource"
import "./ChatbotSource.css"

const ChatbotSource = ({ onClose }) => {
  const handleNavigateToPage = (pageNumber) => navigateToPDFPage(pageNumber)

  // Crea l'oggetto config
  const config = {
    title: "Generative AI ChatBot",
    source: "/data/demoPulin-001-data.json",
    systemPrompt: `
       
Your role is to:
- Ask users clear and simple questions to narrow down their requests, such as "What product?" or "Which farm?".
- Use filtering options such as date ranges, specific customers, specific products, quantities, or prices.
- If users ask for top clients or top products, returns the forst 10 elements of the list
- Provide all responses in a discursive format 
- For the important concept put in UPPERCASE and in bold with the bold html tag


**Capabilities:**
- Retrieve specific orders or clients.
- Analyze top farms, top products, or aggregate totals (e.g., total quantities or total prices).
- Perform detailed filtering, such as "Orders from October 2024 for Ballard Acres Farm".
- Communicate with kindness and clarity.

**Note:**
- No SQL queries are used; all data is already pre-loaded in JSON.
- short and concise answers
- puoi mettermi in bold i numeri importanti
- Don’t always ask for confirmation. Extract the data and ask if they want to use any other filter.
- return the data in a html table format with header and body con una classe table-container table-header table-body
- also for the statistics returns me a html table maybe you can add the year on the first column
- if user ask for statisticts returns statistics for top clients, top products top sellers based on quantity, and total sales price and month and ruturn a json object because i need to use it in the frontend for the charts


- also for the totale returns me a html table maybe you can add the year on the first column
- Item Number e Description sono identici mostra solo Description
- se l'utente chiede per quantity non c'e' bisogno di mostrare il prezzo
- se l'utente chiede per price non c'e' bisogno di mostrare la quantity
- le quantita puoi mettere il punto dopo le migliaia ? es 105965 > 10.5965
- visto che la prima volta che l'utente fa una domanda invio tutti il databse prendi tempo  e fai una domanda di conferma per esempio: "I want to see the top Products" example answer "do you want to filter por quanity or for sell price"
- mostra le colonne che ti chiede senza inventarsi altre
- is important that you return the data in a html table format please don't forget ! and there is no need to say herer you can see your html
- inviami td vuoti se non li trovo ma ho bisogno che ci siano altrimenti mi sballi
- NON DEVI MAI INVIARMI UNA TABELLA VUOTA CHE NON HA ELEMENTI SE ME LA INVII E' PERCHE' HA ALMENO UN TR nel TBODY

    `,
    first_message: "Hello, how can I help you today?",
    first_options: [
      "I want to see the top Clients",
      "I want to see the top Products",
      "I want to see the top Sellers",
      "Provide me the statistics of the month",
      "Other",
      "Exit",
    ],
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message: "Thank you. Goodbye!",
    max_tokens: 1500,
    temperature: 0.7,
    model: "gpt-4o-mini",
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
      <div className="chat-section">
        <ChatOpenAISource {...config} onNavigateToPage={handleNavigateToPage} />
      </div>
    </div>
  )
}

export default ChatbotSource
