// server.js
require("dotenv").config()
const express = require("express")
const OpenAI = require("openai")
const cors = require("cors")

const settings = require("./settings.json")

const app = express()
app.use(cors()) // Permette le richieste da origini diverse (CORS)
app.use(express.json()) // Gestisce JSON nel body delle richieste

// Configura il client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Endpoint per generare un embedding da una domanda
app.post("/api/embedding", async (req, res) => {
  const { questionText } = req.body
  if (!questionText)
    return res.status(400).json({ error: "Question text is required" })

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: questionText,
    })
    res.json(response.data[0].embedding)
  } catch (error) {
    console.error("Error generating embedding:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Endpoint per generare una risposta contestuale con conversazione
app.post("/api/generate-response", async (req, res) => {
  const { bestMatch, questionText, conversationHistory } = req.body
  if (!bestMatch)
    return res.status(400).json({ error: "Best match is required" })

  const contextText = bestMatch.text

  try {
    const response = await openai.chat.completions.create({
      model: settings.model,
      messages: [
        { role: "system", content: settings.system_prompt },
        ...conversationHistory,
        {
          role: "user",
          content: `Context: ${contextText}\nQuestion: ${questionText}`,
        },
      ],
      max_tokens: parseInt(settings.max_tokens),
      temperature: parseFloat(settings.temperature),
    })

    res.json(response.choices[0].message.content.trim())
  } catch (error) {
    console.error("Error generating response:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Porta del server
const PORT = 4999
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
