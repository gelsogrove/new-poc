import settings from "./settings.json"

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

// Function to convert a question into an embedding
export const convertQuestionToEmbedding = async (questionText) => {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: questionText,
      }),
    })
    const data = await response.json()
    return data.data[0].embedding
  } catch (error) {
    console.error("Error converting question to embedding:", error)
    return null
  }
}

export const formatText = (data) => {
  console.log("Input Data Type:", typeof data) // Log the type of input data
  console.log("Input Data:", data) // Log the entire input data for debugging

  // Check if the input is a string
  if (typeof data === "string") {
    // Use a regular expression to extract the JSON part
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
      return { formattedResponse: data, options: [], page: null }
    }
  }

  // Handle the case where data is already an object
  return extractResponseData(data)
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

// Function to calculate cosine similarity between two vectors
export const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

// Function to find the best match in embeddings for a given question embedding
export const findBestMatchInEmbeddings = (embeddingData, questionEmbedding) => {
  let bestMatch = null
  let highestSimilarity = -Infinity
  embeddingData.forEach((item) => {
    const similarity = cosineSimilarity(questionEmbedding, item.embedding)
    if (similarity > highestSimilarity && similarity >= 0.7) {
      highestSimilarity = similarity
      bestMatch = item
    }
  })
  return bestMatch
}

// Function to generate a response with context using OpenAI's API
export const generateResponseWithContext = async (
  bestMatch,
  questionText,
  conversationHistory
) => {
  if (!bestMatch) {
    return "I'm sorry, I couldn't find relevant information to answer your question. Please try rephrasing or asking something else."
  }
  const contextText = bestMatch.text // Assuming bestMatch has a `text` property
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: settings.model,
        messages: [
          {
            role: "system",
            content: settings.system_prompt, // Use the system prompt from settings
          },
          ...conversationHistory,
          {
            role: "user",
            content: `Context from document: ${contextText}\n\nQuestion: ${questionText}\n\nAnswer only with information from the context above.`,
          },
        ],
        max_tokens: settings.max_tokens, // Use value from settings
        temperature: settings.temperature, // Use value from settings
      }),
    })

    const data = await response.json()
    console.log("API Response:", data.choices[0].message.content.trim())
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error("Error generating response:", error)
    return "There was an error generating the response. Please try again."
  }
}

export const navigateToPDFPage = (pageNumber) => {
  const pdfViewer = document.getElementById("pdfViewer")

  if (pdfViewer) {
    const newSrc = `/embedding/washing-machine-001.pdf#page=${pageNumber}&t=${new Date().getTime()}`

    // Remove and re-add the iframe to force refresh
    const parent = pdfViewer.parentNode
    const newIframe = document.createElement("iframe")
    newIframe.id = "pdfViewer"
    newIframe.src = newSrc
    newIframe.width = "100%"
    newIframe.height = "600"
    newIframe.title = "PDF Viewer"

    parent.removeChild(pdfViewer)
    parent.appendChild(newIframe)

    console.log(`Navigating to PDF page: ${pageNumber}`)
  }
}

export const cleanText = (text) => {
  return text
    .replace(/\\n/g, " ") // Sostituisce \n con uno spazio
    .replace(/\\r/g, "") // Rimuove \r se presente
    .replace(/\s+/g, " ") // Riduce spazi bianchi multipli a uno
    .trim() // Rimuove spazi all'inizio e alla fine
}

export const formatBoldText = (text) => {
  // Sostituisci le interruzioni di riga con <br>
  text = text.replace(/\n/g, "<br>")

  // Sostituisci **testo** con <b>testo</b>
  return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
}
