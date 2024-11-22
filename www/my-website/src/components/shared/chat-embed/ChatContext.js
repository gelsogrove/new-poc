import React, { createContext, useContext, useState } from "react"

const ChatContext = createContext()

export const useChat = () => {
  return useContext(ChatContext)
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [quickReplies, setQuickReplies] = useState([])

  return (
    <ChatContext.Provider
      value={{ messages, setMessages, quickReplies, setQuickReplies }}
    >
      {children}
    </ChatContext.Provider>
  )
}
