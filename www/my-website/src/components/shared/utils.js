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
            content: settings.system_prompt, // Use system prompt from settings
          },
        ],
        max_tokens: settings.max_tokens, // Use max_tokens from settings
        temperature: settings.temperature, // Use temperature from settings
      }),
    })

    const data = await response.json()

    if (response.status !== 200) {
      throw new Error(`Error: ${data.error.message}`)
    }

    const content = data.choices[0].message.content
    const jsonStartIndex = content.indexOf("{")
    const jsonEndIndex = content.lastIndexOf("}") + 1

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("No JSON found in the response")
    }

    const jsonResponse = JSON.parse(
      content.substring(jsonStartIndex, jsonEndIndex)
    )

    return {
      response: jsonResponse.response, // The main bot response
      options: jsonResponse.options, // The dynamically generated options
    }
  } catch (error) {
    console.error("Error generating response:", error)
    return {
      response: settings.error_message, // Use error message from settings
      options: ["Other", "Exit"],
    }
  }
}
