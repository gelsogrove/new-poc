// src/components/popups/generativeAI/GenerativeAIPopup.js

import React, { useState } from "react"
import ChatOpenAI from "../../shared/ChatOpenAI"
import "./GenerativeAIPopup.css"

const GenerativeAIPopup = ({ onClose }) => {
  const [files] = useState([
    { name: "Report1.pdf", link: "/path/to/Report1.pdf" },
    { name: "Invoice2.pdf", link: "/path/to/Invoice2.pdf" },
    { name: "Contract3.pdf", link: "/path/to/Contract3.pdf" },
  ])

  return (
    <div className="generative-ai-popup">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      {/* Sezione Chat (più larga) */}
      <div className="chat-section">
        <ChatOpenAI type="generative" />
      </div>

      {/* Sezione Lista File */}
      <div className="files-section">
        <h3>Generated Files</h3>
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index} className="file-item">
              <a href={file.link} download>
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default GenerativeAIPopup
