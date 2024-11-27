// Funzione per convertire una domanda in un embedding (chiamata al server backend)

export const convertQuestionToEmbedding = async (
  apiUrl,
  questionText,
  model
) => {
  if (!questionText) {
    console.warn("convertQuestionToEmbedding: questionText is empty.")
    return null
  }

  try {
    const response = await fetch(apiUrl + "/washing/emb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionText, model }),
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
  apiUrl,
  bestMatch,
  questionText,
  conversationHistory,
  systemPrompt,
  max_tokens,
  temperature,
  model
) => {
  if (!bestMatch) {
    return "I'm sorry, I couldn't find relevant information to answer your question. Please try rephrasing or asking something else."
  }

  try {
    const response = await fetch(apiUrl + "/washing/resp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bestMatch,
        questionText,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model,
      }),
    })

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

let currentAudio = null // Variabile per tenere traccia dell'audio corrente

// Funzione per generare audio TTS
export const generateSpeech = async (
  apiUrl,
  text,
  voice = "alloy",
  format = "mp3"
) => {
  try {
    const response = await fetch(apiUrl + "/washing/generate-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice,
        format,
      }),
    })

    // Controlla se la risposta contiene i dati audio
    if (response.ok) {
      const audioData = await response.arrayBuffer() // Necessario per gestire la risposta binaria
      const audioBlob = new Blob([audioData], { type: `audio/${format}` })
      const audioUrl = URL.createObjectURL(audioBlob)
      currentAudio = new Audio(audioUrl) // Salva l'audio corrente
      currentAudio.play() // Riproduci l'audio
    } else {
      console.error("Nessun audio restituito dall'API.")
    }
  } catch (error) {
    console.error(
      "Errore durante la chiamata all'API di generazione audio:",
      error
    )
  }
}

// Funzione per interrompere l'audio in riproduzione
export const stopSpeech = () => {
  if (currentAudio) {
    currentAudio.pause() // Ferma l'audio
    currentAudio.currentTime = 0 // Riporta l'audio all'inizio
    currentAudio = null // Resetta la variabile
  }
}
