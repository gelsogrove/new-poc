import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import ChatbotPopup from "../../www/popups/chatbot-embed/ChatbotPopup"
import ChatbotSecurity from "../../www/popups/chatbot-security/ChatbotSecurity"
import ChatbotSource from "../../www/popups/chatbot-source/ChatbotSourcePopup"
import Popup from "../../www/popups/Popup"
import "./Pulling.css"

const Pulling = () => {
  const { t } = useTranslation() // Access translation function
  const [activePopup, setActivePopup] = useState(null)

  const openPopup = (popupType) => {
    setActivePopup(popupType)
  }

  const closePopup = () => {
    setActivePopup(null)
  }

  return (
    <div>
      <Popup isOpen={activePopup === "chatbot"} onClose={closePopup}>
        <ChatbotPopup onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "chatbotsource"} onClose={closePopup}>
        <ChatbotSource onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "security"} onClose={closePopup}>
        <ChatbotSecurity onClose={closePopup} />
      </Popup>

      <div className="home-container">
        <h1 className="ourservice">Poulin Grain demo </h1>
        <br />
        <section className="features">
          <div className="feature-item" onClick={() => openPopup("chatbot")}>
            <div className="image-container">
              <img
                src="../images/chatbot.webp"
                alt={t("home.features.chatbot.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>Knowledge library</h3>
                <div className="subtitle"> </div>
              </div>
            </div>
          </div>

          <div
            className="feature-item"
            onClick={() => openPopup("chatbotsource")}
          >
            <div className="image-container">
              <img
                src="../images/generative.webp"
                alt={t("home.features.chatbot.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>Sales Reader</h3>
                <div className="subtitle"> </div>
              </div>
            </div>
          </div>

          <div className="feature-item" onClick={() => openPopup("security")}>
            <div className="image-container">
              <img
                src="../images/security.webp"
                className="feature-image"
                alt=""
              />
              <div className="overlay">
                <h3>Secuirty</h3>
                <div className="subtitle"> </div>
              </div>
            </div>
          </div>
        </section>{" "}
      </div>
    </div>
  )
}

export default Pulling
