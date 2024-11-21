// src/components/popups/chatbot/ChatbotPopup.js

import React from "react"
import { navigateToPDFPage } from "../../shared/chat-embed/utils"
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
- If users ask for statistics (like top clients or top products), returns the forst 10 elements of the list
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
- Item Number e Description sono identici mostra solo Description
- se l'utente chiede per quantity non c'e' bisogno di mostrare il prezzo
- se l'utente chiede per price non c'e' bisogno di mostrare la quantity

 
**Examples:**
- "Show me all orders for October 2024" -> Respond with the data.
- "How many customers ordered products over $100,000?" -> Provide a concise summary and detailed data if requested.
- is important that you return the data in a html table format please don't forget ! and there is no need to say herer you can see your html
- inviami td vuoti se non li trovo ma ho bisogno che ci siano altrimenti mi sballi la tabella
- non mostrare gli ID  a meno che il cliente chieda esplicitamente di mostrarli
- mostra le colonne che ti chiede senza inventarsi altre
 

    `,
    first_message: "Hello, how can I help you today?",
    first_options: [
      "I want to see the top  Clients",
      "I want to see the top Products",
      "I wanto to see the top Sellers ?",
      "Do you want to see the statistics of the month ?",
      "Other",
      "Exit",
    ],
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message: "Thank you. Goodbye!",
    max_tokens: 1000,
    temperature: 0.6,
    model: "gpt-4o-mini",
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
