// src/components/popups/Popup.js

import React from "react"
import "./Popup.css"

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  const handleClose = (e) => {
    if (e.target.className === "popup-overlay") {
      onClose()
    }
  }

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Popup
