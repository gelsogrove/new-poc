// src/components/popups/Popup.js

import React from "react"
import "./Popup.css"

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="popup-overlay">
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
