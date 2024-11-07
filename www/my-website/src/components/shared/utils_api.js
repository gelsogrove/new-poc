// Funzione per convertire una domanda in un embedding (chiamata al server backend)

export const convertQuestionToEmbedding = async (questionText) => {
  if (!questionText) {
    console.warn("convertQuestionToEmbedding: questionText is empty.")
    return null
  }

  try {
    const response = await fetch("http://localhost:4999/api/embedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionText }),
    })

    if (!response.ok) {
      console.error("Error fetching embedding:", response.statusText)
      return null
    }

    const embedding = await response.json()
    return embedding
  } catch (error) {
    console.error("Error fetching embedding:", error)
    return null
  }
}

// Funzione per generare una risposta con contesto (chiamata al server backend)
export const generateResponseWithContext = async (
  bestMatch,
  questionText,
  conversationHistory
) => {
  if (!bestMatch) {
    return "I'm sorry, I couldn't find relevant information to answer your question. Please try rephrasing or asking something else."
  }

  try {
    const response = await fetch(
      "http://localhost:4999/api/generate-response",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bestMatch, questionText, conversationHistory }),
      }
    )

    if (!response.ok) {
      console.error("Error generating response:", response.statusText)
      return "There was an error generating the response. Please try again."
    }

    const messageContent = await response.json()
    return messageContent
  } catch (error) {
    console.error("Error generating response:", error)
    return "There was an error generating the response. Please try again."
  }
}
