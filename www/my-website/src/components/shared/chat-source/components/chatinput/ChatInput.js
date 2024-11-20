import React from "react"
import "./ChatInput.css"

const ChatInput = ({
  inputValue,
  setInputValue,
  isLoading,
  handleSend,
  handleQuickReply,
}) => {
  return (
    <div className="chat-input input-group">
      <input
        type="text"
        className="form-control input-wide"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <div className="input-group-append">
        <button
          className="btn btn-primary"
          onClick={() => handleSend(inputValue)}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatInput
