// src/utils.js
import settings from "./settings.json"

export const updateQuickReplies = (options) => {
  const updatedOptions = [...options]
  if (!updatedOptions.includes("Other")) updatedOptions.push("Other")
  if (!updatedOptions.includes("Menu")) updatedOptions.push("Menu")
  return updatedOptions
}

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

export const addBotLoadingMessage = (setMessages) => {
  const loadingMessage = {
    id: crypto.randomUUID(),
    sender: "bot",
    text: "Generating a response for you...",
  }
  setMessages((prevMessages) => [...prevMessages, loadingMessage])
}

export const replaceBotMessageWithError = (setMessages, errorMessage) => {
  setMessages((prevMessages) =>
    prevMessages.slice(0, -1).concat({
      id: crypto.randomUUID(),
      sender: "bot",
      text: errorMessage,
    })
  )
}

export const navigateToPDFPage = (pageNumber) => {
  const pdfViewer = document.getElementById("pdfViewer")
  if (pdfViewer) {
    pdfViewer.src = ""
    setTimeout(() => {
      pdfViewer.src = `http://localhost:3000/embedding/washing-machine-001.pdf#page=${pageNumber}`
    }, 500)
  } else {
    console.error("PDF viewer not found!")
  }
}

export const generateResponseWithContext = async (
  userQuestion,
  conversationHistory,
  apiKey
) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...conversationHistory.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user",
            content: userQuestion,
          },
          {
            role: "system",
            content: settings.system_prompt,
          },
        ],
        max_tokens: settings.max_tokens,
        temperature: settings.temperature,
      }),
    })

    const data = await response.json()

    if (response.status !== 200) {
      console.error(`Error from OpenAI: ${data.error.message}`)
      throw new Error(`Error: ${data.error.message}`)
    }

    // Controlla la struttura della risposta
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No choices returned from the response")
    }

    const messageContent = data.choices[0].message.content
    const jsonStartIndex = messageContent.indexOf("{")
    const jsonEndIndex = messageContent.lastIndexOf("}") + 1

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("No JSON found in the response content")
    }

    const jsonResponse = JSON.parse(
      messageContent.substring(jsonStartIndex, jsonEndIndex)
    )

    const options = jsonResponse.options || []
    // TODO : FAI UNA FUNZIONE
    if (!options.includes("Other")) {
      options.push("Other")
    }
    if (!options.includes("Menu")) {
      options.push("Menu")
    }

    return {
      response: jsonResponse.response || "No response provided",
      options: options,
      page: jsonResponse.page || null,
    }
  } catch (error) {
    console.error("Error generating response:", error)
    return {
      response: settings.error_message,
      options: ["Other", "Menu"], // Assicurati di avere un fallback
      page: null,
    }
  }
}

export const formatText = (text) => {
  if (typeof text !== "string") {
    console.error("formatText: Expected string but received", typeof text)
    return text
  }

  return text.split("\n").map((str, index) => <p key={index}>{str}</p>)
}
