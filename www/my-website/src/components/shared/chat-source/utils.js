// Function to add a loading message from the bot
export const addBotLoadingMessage = (setMessages) => {
  setMessages((prevMessages) => [
    ...prevMessages,
    { id: crypto.randomUUID(), sender: "bot", text: "..." }, // Placeholder for loading message
  ])
}

// Function to replace the bot's last message with an error message
export const replaceBotMessageWithError = (setMessages, errorMessage) => {
  setMessages((prevMessages) =>
    prevMessages.slice(0, -1).concat({
      id: crypto.randomUUID(),
      sender: "bot",
      text: errorMessage,
    })
  )
}

// Function to load embedding data from a given URL
export const loadEmbeddingData = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Failed to load embedding data")
    return await response.json()
  } catch (error) {
    console.error("Embedding loading error:", error)
    return null
  }
}

export const formatText = (data) => {
  if (typeof data === "string") {
    const jsonStringMatch = data.match(/{.*}/s) // Matches the first JSON object found in the string

    if (jsonStringMatch) {
      const jsonString = jsonStringMatch[0] // Extracted JSON string
      try {
        const jsonData = JSON.parse(jsonString) // Parse the extracted JSON string
        return extractResponseData(jsonData) // Update this function to return page too
      } catch (error) {
        console.error("Error parsing input string:", error)
        return {
          formattedResponse: "Invalid input format.",
          options: [],
          page: null,
        } // Return the original string if parsing fails
      }
    } else {
      // If no JSON was found, return the original data
      return { formattedResponse: data, options: [] }
    }
  }

  const x = extractResponseData(data)
  console.log(x)
  return x
}

// Update the extractResponseData function to return the page number
const extractResponseData = (data) => {
  if (typeof data === "object" && data.response) {
    return {
      formattedResponse: data.response.trim(),
      options: Array.isArray(data.options) ? data.options : [],
      page: data.page || null, // Return the page number, defaulting to null if it doesn't exist
    }
  }

  console.error(
    "Invalid input format: Data does not contain expected structure."
  )
  return { formattedResponse: "Invalid input format.", options: [], page: null }
}

export const cleanText = (text) => {
  return text
    .replace(/\\n/g, " ") // Sostituisce \n con uno spazio
    .replace(/\\r/g, "") // Rimuove \r se presente
    .replace(/\s+/g, " ") // Riduce spazi bianchi multipli a uno
    .trim() // Rimuove spazi all'inizio e alla fine
}

export const formatBoldText = (text) => {
  // Rimuovi i blocchi di codice HTML e altri delimitatori
  text = text.replace(/```html|html```|```/g, "") // Rimuove tutti i delimitatori di codice

  text = text.replace(/\n/g, "<br>")

  // Sostituisci **testo** con <b>testo</b>
  return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
}
