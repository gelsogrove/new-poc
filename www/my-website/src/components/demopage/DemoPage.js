import React from "react"
import ChatOpenAISource from "../shared/chat-source/ChatOpenAISouce"
import "./DemoPage.css"
const DemoPage = () => {
  // Crea l'oggetto config
  const config = {
    title: "Customzie chatBot",
    source: "/data/demoPulin-001-data.json",
    systemPrompt:
      "Sei un assistente virtuale che risponde alle domande degli utenti in modo chiaro e preciso. Utilizza un linguaggio semplice e accessibile per tutti gli utenti, indipendentemente dalla loro età o dall'apparecchiatura utilizzata per interagire con il sistema, converti la risposta  in una struttura json con customers, filters, actions, e un nodo response dove andremo a mettere il testo della risposta con x e y o z come proprieta dove bisogna fare il replace con il calcolo del db ",
    first_message: "Hello, how can i help you today?.",

    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message: "Thank you for. Goodbye!",
    max_tokens: 300,
    temperature: 0.6,
    model: "gpt-4o-mini",
  }

  return (
    <div className="chat-container">
      <ChatOpenAISource {...config} />
    </div>
  )
}

export default DemoPage
