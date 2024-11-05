export const generateResponseWithContext = async (
  bestMatch,
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
            content: `Rispondi alla domanda  con un massimo di 250 token dell'utente e fornisci tre opzioni di risposta che l'utente potrebbe scegliere per continuare la conversazione. Formatta la risposta in JSON come segue: { "response": "Testo della risposta", "options": ["Opzione 1", "Opzione 2", "Opzione 3"] }`,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (response.status !== 200) {
      throw new Error(`Error: ${data.error.message}`)
    }

    // Estrazione del JSON dal testo
    const content = data.choices[0].message.content

    // Trova la parte della risposta che contiene il JSON
    const jsonStartIndex = content.indexOf("{")
    const jsonEndIndex = content.lastIndexOf("}") + 1

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("No JSON found in the response")
    }

    // Estrai e fai il parsing del JSON
    const jsonResponse = JSON.parse(
      content.substring(jsonStartIndex, jsonEndIndex)
    )

    return {
      response: jsonResponse.response, // La risposta principale del bot
      options: jsonResponse.options, // Le opzioni generate dinamicamente
    }
  } catch (error) {
    console.error("Error generating response:", error)
    return {
      response: "I encountered an error. Please try again later.",
      options: ["Other", "Exit"],
    }
  }
}

// Funzione per formattare il testo
export const formatText = (text) => {
  if (typeof text !== "string") {
    console.error("formatText: Expected string but received", typeof text)
    return text
  }

  return text.split("\n").map((str, index) => <p key={index}>{str}</p>)
}
