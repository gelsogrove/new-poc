// src/components/ChatBase.js
import { useEffect } from "react"

export const ChatBase = () => {
  useEffect(() => {
    // Configurazione del chatbot
    window.embeddedChatbotConfig = {
      chatbotId: "RzaTJfRfK2xeTKWujji9J",
      domain: "www.chatbase.co",
    }

    // Creazione dinamica dello script
    const script = document.createElement("script")
    script.src = "https://www.chatbase.co/embed.min.js"
    script.defer = true
    script.setAttribute("chatbotId", "RzaTJfRfK2xeTKWujji9J")
    script.setAttribute("domain", "www.chatbase.co")

    // Aggiunta dello script al DOM
    document.body.appendChild(script)

    // Cleanup: rimuove lo script quando il componente viene smontato
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null // Non ritorna alcun elemento visivo, gestisce solo lo script
}

export default ChatBase
