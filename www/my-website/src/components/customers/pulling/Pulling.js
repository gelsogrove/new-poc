import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import ChatbotEmbed from "../../www/popups/chatbot-embed/ChatbotEmbedPopup"
import ChatbotSecurity from "../../www/popups/chatbot-security/ChatbotSecurityPopup"
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
        <ChatbotEmbed onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "chatbotsource"} onClose={closePopup}>
        <ChatbotSource onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "security"} onClose={closePopup}>
        <ChatbotSecurity onClose={closePopup} />
      </Popup>

      <div className="home-container">
        <h1 className="ourservice">Poulin Grain Demo </h1>
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
        </section>{" "}
      </div>
    </div>
  )
}

export default Pulling
