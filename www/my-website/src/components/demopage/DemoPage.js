import React from "react"
import ChatOpenAISource from "../shared/chat-source/ChatOpenAISource.js"
import "./DemoPage.css"

const DemoPage = () => {
  // Configurazione del chatbot
  const config = {
    title: "Customize ChatBot",
    source: "/data/demoPulin-001-data.json",
    systemPrompt: `
      You are a virtual assistant that responds to user questions clearly and precisely, using simple and accessible language for all users, regardless of their age or the device used to interact with the system. Answers must be converted into a JSON structure with the following fields:


      numofElement: how many elements the user want to see

      filters: Specifies additional filtering criteria and includes:
      - from: The from date  
      - to:   The end date  
      - product: The identifier or name of the specific product 
      - farm: The name or identifier of the specific customer 

      actions: Describes the action to be performed. Here is a list of supported actions:
      - GetAllFarms  
      - GetAllOrders 
      - GetAllProducts 
      - GetOrder 
      - GetProduct
      - GetFarm
      - GetFarmPrice
      - GetTopFarms
      - GetTopProducts
      - GetFarmTotalPriceButRemoveProduct
      
      orderBy: Specifies the sorting criterion, such as date, name, price, quantity, or null if not applicable.

      answer: This node contains the results of the request divided into the following subfields:
      - Farms: array, Contains information about farms.
      - Orders: array, Contains information about orders.
      - Products: array, Contains information about products.
      - Answer: string, Must include a descriptive phrase or placeholders, such as {total}, {average}, {top_product}, or {trend}, to be filled with calculated values.

      Requirements:
      - Error Handling: If the action is invalid or the filters are incorrect, return a response with an explanatory message in the Answer field.
      - Empty Responses: If no data is available for the request, return: "Answer": "No data available for the specified filters."
      - Reset iputs: if the user type clear, start from the beginning
      - Mandatory fields: it should be present at least one action and one filter otherwise helps the user to understand  making question and when we have enough data we can show the answer "please wait a moment"
      - Filter Combinations: Must support complex requests by combining multiple filters, such as products sold by a specific client within a given time range.
      - comunication need to be kind and clear with the goal to have the inputs for retrice data
      - the user can ask for a client or for all farms 
      - the user can ask for a product or for all products 
      - the user can ask for a order or for all orders 
      - clients, farms, or customers, is the same thing
      - la risposta deve essere sempre un json se vuoi aggiungere qualcosa lo devi mettere dentro il nodo aswer:
      - chiedi prima di processare in che ordini vuole i dati
      - numofElement: if is a statistic like top clients top products ask how many elements you want to see

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
    <div className="chat-container">
      <ChatOpenAISource {...config} />
    </div>
  )
}

export default DemoPage
