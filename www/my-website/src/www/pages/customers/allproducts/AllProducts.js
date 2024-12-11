import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import NavBar from "../../../components/navbar/Navbar"
import Popup from "../../../components/popups/Popup"
import ChatbotBrokerPopup from "../../../components/popups/chatbot-broker/ChatbotBrokerPopup"
import ChatbotEmbed from "../../../components/popups/chatbot-embed/ChatbotEmbedPopup"
import ChatbotPoulinPopup from "../../../components/popups/chatbot-poulin/ChatbotPoulinPopup"
import CustomVisionPopup from "../../../components/popups/custom-vision/CustomVisionPopup"
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
  const clearAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
    })
    window.location.href = "/login"
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
        <ChatbotPoulinPopup onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "broker"} onClose={closePopup}>
        <ChatbotBrokerPopup onClose={closePopup} />
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
                src="../images/sales-reader.webp"
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
                <h3>Chatbot Broker</h3>
                <div className="subtitle"> </div>
              </div>
            </div>
          </div>
        </section>{" "}
        <div className="logout-container">
          <a href onClick={clearAllCookies} className="logout-link">
            Logout
          </a>
        </div>
      </div>
    </div>
  )
}

export default AllProducts
