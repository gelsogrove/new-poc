import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import NavBar from "../../www/navbar/Navbar"
import ChatbotBroker from "../../www/popups/chatbot-broker/ChatbotBrokerPopup"
import ChatbotEmbed from "../../www/popups/chatbot-embed/ChatbotEmbedPopup"
import ChatbotSecurity from "../../www/popups/chatbot-security/ChatbotSecurityPopup"
import ChatbotSource from "../../www/popups/chatbot-source/ChatbotSourcePopup"
import CustomVisionPopup from "../../www/popups/custom-vision/CustomVisionPopup"
import Popup from "../../www/popups/Popup"
import "./AllProducts.css"

const AllProducts = () => {
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
      <NavBar />
      <Popup isOpen={activePopup === "customVision"} onClose={closePopup}>
        <CustomVisionPopup onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "chatbot"} onClose={closePopup}>
        <ChatbotEmbed onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "chatbotsource"} onClose={closePopup}>
        <ChatbotSource onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "security"} onClose={closePopup}>
        <ChatbotSecurity onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "broker"} onClose={closePopup}>
        <ChatbotBroker onClose={closePopup} />
      </Popup>

      <div className="home-container-allproducts">
        <h1 className="ourservice">Customize chatbots </h1>
        <br />
        <section className="features">
          <div
            className="feature-item"
            onClick={() => openPopup("customVision")}
          >
            <div className="image-container">
              <img
                src="../images/dalle.webp"
                alt={t("home.features.custom_vision.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>{t("home.features.custom_vision.title")}</h3>
                <div className="subtitle">
                  {t("home.features.custom_vision.subtitle")}
                </div>
              </div>
            </div>
          </div>
          <div className="feature-item" onClick={() => openPopup("chatbot")}>
            <div className="image-container">
              <img
                src="../images/chatbot.webp"
                alt={t("home.features.chatbot.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>Custom Embedding</h3>
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

          <div className="feature-item" onClick={() => openPopup("broker")}>
            <div className="image-container">
              <img src="../images/db.webp" className="feature-image" alt="" />
              <div className="overlay">
                <h3>Save context</h3>
                <div className="subtitle"> </div>
              </div>
            </div>
          </div>
        </section>{" "}
      </div>
    </div>
  )
}

export default AllProducts
