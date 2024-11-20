import settings from "./settings.json"

const server =
  window.location.hostname === "localhost" ? settings.local : settings.server

export const generateResponseWithContext = async (
  questionText,
  conversationHistory,
  systemPrompt,
  max_tokens,
  temperature,
  model
) => {
  try {
    const response = await fetch(server + "/api1/resptemp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionText,
        conversationHistory,
        systemPrompt,
        max_tokens,
        temperature,
        model,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate response")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error generating response:", error)
    throw error
  }
}

export const initializeData = async () => {
  try {
    const response = await fetch(`${server}/api1/initialize`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error during initialize data fetch:", error)
    throw error
  }
}
