import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import ChatbotPopup from "../popups/chatbot/ChatbotPopup"
import Popup from "../popups/Popup"
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

      <div className="home-container">
        <h1 className="ourservice">Pulling demo</h1>
        <section className="features">
          <div className="feature-item" onClick={() => openPopup("chatbot")}>
            <div className="image-container">
              <img
                src="../images/chatbot.webp"
                alt={t("home.features.chatbot.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>{t("home.features.chatbot.title")}</h3>
                <div className="subtitle">
                  {t("home.features.chatbot.subtitle")}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Pulling
