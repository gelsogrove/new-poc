/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react"
import "./Home.css" // Assicurati che questo file CSS esista
import Info from "./info/Info"
import Landing from "./landing/Landing"
import Popup from "./popups/Popup" // Import del componente Popup
import Technologies from "./technologies/Technologies"

// Import aggiuntivo
import { Howworks } from "./howworks/HowWorks"
import ChatbotPopup from "./popups/chatbot/ChatbotPopup"
import CustomVisionPopup from "./popups/customVision/CustomVisionPopup"
import GenerativeAIPopup from "./popups/generativeAI/GenerativeAIPopup"
const Home = () => {
  // Stato per tenere traccia della popup attiva
  const [activePopup, setActivePopup] = useState(null)

  // Funzione per aprire la popup
  const openPopup = (popupType) => {
    setActivePopup(popupType)
  }

  // Funzione per chiudere la popup
  const closePopup = () => {
    setActivePopup(null)
  }

  return (
    <div>
      {/* Popup per Custom Vision */}
      <Popup isOpen={activePopup === "customVision"} onClose={closePopup}>
        <CustomVisionPopup onClose={closePopup} />
      </Popup>
      {/* Popup per Chatbot */}
      <Popup isOpen={activePopup === "chatbot"} onClose={closePopup}>
        <ChatbotPopup onClose={closePopup} />
      </Popup>
      {/* Popup per Generative AI */}
      <Popup isOpen={activePopup === "generativeAI"} onClose={closePopup}>
        <GenerativeAIPopup onClose={closePopup} />
      </Popup>
      <div className="home-container">
        <header className="header">
          <h1 className="logo">Human in the loops</h1>
        </header>

        <h1 className="ourservice">Our Services</h1>
        <section className="features">
          <div
            className="feature-item"
            onClick={() => openPopup("customVision")}
          >
            <div className="image-container">
              <img
                src="../images/dalle.webp"
                alt="Custom Vision"
                className="feature-image"
              />
              <div className="overlay">
                <h3>Custom Vision</h3>
                <div className="subtitle">
                  Enhance your quality control process with AI vision solutions.
                </div>
              </div>
            </div>
          </div>

          <div className="feature-item" onClick={() => openPopup("chatbot")}>
            <div className="image-container">
              <img
                src="../images/chatbot.webp"
                alt="Custom Chatbots"
                className="feature-image"
              />
              <div className="overlay">
                <h3>Custom Chatbots</h3>
                <div className="subtitle">
                  Transform your company with Intelligent AI Conversations.
                </div>
              </div>
            </div>
          </div>
        </section>
        <Landing />
      </div>
      <Info />

      <div className="footer">
        <Howworks />
        <Technologies />
      </div>
    </div>
  )
}

export default Home
