// src/components/info/Info.js
import React from "react"
import "./Info.css" // Assicurati che questo file esista

const Info = () => {
  return (
    <div className="info-container">
      <div className="info-text">
        <p>
          <b>Human-in-the-Loop</b> (HITL) is an approach in artificial
          intelligence that integrates human intervention in the stages of
          training, fine-tuning and data collection, ensuring optimal model
          accuracy. It is essential that operators receive adequate training so
          they can effectively contribute to this continuous improvement
          process.
        </p>
      </div>
      <div className="info-image">
        <img src="../images/HUMANLOOP.webp" alt="Human-in-the-Loop" />
      </div>
    </div>
  )
}

export default Info
