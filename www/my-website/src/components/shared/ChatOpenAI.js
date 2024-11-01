import React, { useEffect, useState } from "react"
import "./ChatOpenAI.css"

const ChatOpenAI = () => {
  const [inputValue, setInputValue] = useState("")
  const [embeddingData, setEmbeddingData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Hello! Feel free to ask any questions related to washing machines.",
    },
  ])

  useEffect(() => {
    const loadEmbeddingData = async () => {
      try {
        const response = await fetch("/embedding/washing-machine-001.json")
        if (!response.ok) throw new Error("Failed to load embedding data")
        const data = await response.json()
        setEmbeddingData(data)
      } catch (error) {
        console.error("Embedding loading error:", error)
      }
    }
    loadEmbeddingData()
  }, [])

  const convertQuestionToEmbedding = async (questionText) => {
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
      console.error(
        "Errore nella conversione della domanda in embedding:",
        error
      )
      return null
    }
  }

  const findBestMatchInEmbeddings = (questionEmbedding) => {
    let bestMatch = null
    let highestSimilarity = -Infinity

    embeddingData.forEach((item) => {
      const similarity = cosineSimilarity(questionEmbedding, item.embedding)
      if (similarity > highestSimilarity && similarity >= 0.7) {
        // Soglia di similarità
        highestSimilarity = similarity
        bestMatch = item
      }
    })

    return bestMatch
  }

  const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0)
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0))
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  const generateResponseWithContext = async (bestMatch, questionText) => {
    if (!bestMatch) {
      return "I'm sorry, I couldn't find relevant information to answer your question. Please try rephrasing or asking something else."
    }

    const contextText = bestMatch.text

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a highly courteous and professional assistant representing a customer support team for a product. Please ensure your responses are polite, supportive, and maintain a friendly tone suitable for customer assistance. website: https://www.lg.com/cac/soporte/producto/lg-WF-T1477TP",
              },
              {
                role: "user",
                content: `Context from document: ${contextText}\n\nQuestion: ${questionText}\n\nAnswer only with information from the context above.`,
              },
            ],
            max_tokens: 150,
            temperature: 0.3,
          }),
        }
      )
      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error("Errore nella generazione della risposta:", error)
      return "There was an error generating the response. Please try again."
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: inputValue,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputValue("")
    setIsLoading(true)

    const loadingMessage = {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Generating a response for you...",
    }
    setMessages((prevMessages) => [...prevMessages, loadingMessage])

    try {
      // Controllo per situazioni di emergenza
      const urgentPatterns = [
        /emergenza/i,
        /fuoco/i,
        /incendio/i,
        /aiuto/i,
        /pericolo/i,
        /scoppia/i,
        /allagando/i,
        /difficoltà/i,
        /situazione critica/i,
      ]

      const isUrgent = urgentPatterns.some((pattern) =>
        pattern.test(inputValue)
      )

      if (isUrgent) {
        setMessages((prevMessages) =>
          prevMessages.slice(0, -1).concat({
            id: crypto.randomUUID(),
            sender: "bot",
            text: "For urgent assistance, please contact Pino la Lavatrice at 657457575.",
          })
        )
        setIsLoading(false)
        return // Termina la funzione per non continuare
      }

      // 1. Converte la domanda in embedding
      const questionEmbedding = await convertQuestionToEmbedding(inputValue)
      if (!questionEmbedding)
        throw new Error("Failed to generate question embedding")

      // 2. Trova la corrispondenza migliore
      const bestMatch = findBestMatchInEmbeddings(questionEmbedding)

      // 3. Genera risposta usando il contesto
      const botResponse = await generateResponseWithContext(
        bestMatch,
        inputValue
      )

      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: botResponse,
        })
      )
    } catch (error) {
      console.error("Error in handling send:", error)
      setMessages((prevMessages) =>
        prevMessages.slice(0, -1).concat({
          id: crypto.randomUUID(),
          sender: "bot",
          text: "There was an error processing your request. Please try again.",
        })
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chat-openai">
      <h3>Chatbot Washing Machine Assistant</h3>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.sender === "user" ? "user-message" : "bot-message"
            }`}
          >
            <span className="message-text">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatOpenAI
