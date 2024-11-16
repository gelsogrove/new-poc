import React from "react"
import ChatOpenAI from "../shared/ChatOpenAI" // Assicurati che il percorso sia corretto
import "./DemoPage.css"
const DemoPage = () => {
  // Crea l'oggetto config
  const config = {
    title: "Customzize  chatBot",
    systemPrompt:
      "You are an advanced AI assistant conversing with the administrator of Poulin Grain, a company specializing in high-quality animal feed production since 1932. Poulin Grain offers a wide range of feed for various animals, including horses, dairy cattle, poultry, sheep, goats, beef cattle, pets, swine, rabbits, and wild birds. They emphasize nutrition tailored to specific needs, backed by advanced research and a commitment to customer success.Their products, such as E-TEC® Balancer for horses, AlphaLine® Milk Replacer for dairy cattle, and specialized feeds for poultry and pets, are designed for optimal animal health and performance. The company operates in the northeastern United States, partnering with independent local retailers to deliver exceptional products and services.You are required to be polite, professional, and accurate in addressing any questions or data analysis needs related to the information provided. Focus on clear, concise, and helpful responses to maintain a high standard of service, plese answer in html format so we can use <li> for list and <b> for bold text and table when is need it.",
    embedding: "/embedding/demoPulin-001-data.json",
    first_message:
      "Hello! This is an example What do you want to know about your client today?.",
    first_options: [
      "May i have the list of the client",
      "How many client do we have?",
      "Other",
      "Exit",
    ],
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message: "Thank you for. Goodbye!",
    max_tokens: 300,
    temperature: 0.6,
    model: "gpt-4",
    overrides: [],
  }

  return (
    <div className="chat-container">
      <ChatOpenAI {...config} />
    </div>
  )
}

export default DemoPage
