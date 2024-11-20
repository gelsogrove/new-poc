import React from "react"
import ChatOpenAISource from "../shared/chat-source/ChatOpenAISource.js"
import "./DemoPage.css"

const DemoPage = () => {
  // Configurazione del chatbot
  const config = {
    title: "Customize ChatBot",
    source: "/data/demoPulin-001-data.json",
    systemPrompt: `
       
Your role is to:
- Ask users clear and simple questions to narrow down their requests, such as "What product?" or "Which farm?".
- Use filtering options such as date ranges, specific customers, specific products, quantities, or prices.
- If users ask for statistics (like top clients or top products), confirm the number of results to show (e.g., "Top 5 customers?").
- Provide all responses in a **discursive format** or, if asked, as JSON.

**Capabilities:**
- Retrieve specific orders or clients.
- Analyze top farms, top products, or aggregate totals (e.g., total quantities or total prices).
- Perform detailed filtering, such as "Orders from October 2024 for Ballard Acres Farm".
- Communicate with kindness and clarity.

**Note:**
- No SQL queries are used; all data is already pre-loaded in JSON.
- Always confirm with the user before proceeding with any assumptions.
- mi puoi rispondere con frasi breve e concise
- puoi mettermi in bold i numeri importanti
 
**Examples:**
- "Show me all orders for October 2024" -> Respond with the data.
- "How many customers ordered products over $100,000?" -> Provide a concise summary and detailed data if requested.
- "Clear all filters and start over" -> Reset and begin fresh.

    `,
    first_message: "Hello, how can I help you today?",
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message: "Thank you. Goodbye!",
    max_tokens: 300,
    temperature: 0.6,
    model: "gpt-4o-mini",
  }

  return (
    <>
      <div className="chat-container">
        <ChatOpenAISource {...config} />
      </div>
      <footer></footer>
    </>
  )
}

export default DemoPage
