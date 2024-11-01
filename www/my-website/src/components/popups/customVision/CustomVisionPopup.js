// src/components/popups/customVision/CustomVisionPopup.js

import React from "react"
import "./CustomVisionPopup.css" // Importa il CSS specifico

const CustomVisionPopup = ({ onClose }) => (
  <div className="popup">
    <button className="close-button" onClick={onClose}>
      ×
    </button>

    <div className="video-container">
      <video width="100%" height="340" controls>
        <source src="../custom.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <br />
      <p className="text">
        In this video, we present the proof of concept (POC) we developed for a
        manufacturing client who needed a solution to detect scratches in their
        production process.
        <br />
        <br /> As demonstrated, our AI can efficiently identify defects and scan
        each item’s VIN number, all happening locally with Edge AI. This
        approach eliminates the need for an internet connection, making the
        process not only faster but also significantly more cost-effective than
        traditional cloud-based AI solutions.
      </p>
    </div>
  </div>
)

export default CustomVisionPopup
