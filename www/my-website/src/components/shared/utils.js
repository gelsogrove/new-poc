// utils.js
import settings from "./settings.json" // Import settings

// Function to format text by splitting it into paragraphs
export const formatText = (text) => {
  if (typeof text !== "string") {
    console.error("formatText: Expected string but received", typeof text)
    return text
  }

  return text.split("\n").map((str, index) => <p key={index}>{str}</p>)
}

// Function to generate a response with context from OpenAI
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
