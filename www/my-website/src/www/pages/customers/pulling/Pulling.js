import React, { useState } from "react"
import { Helmet } from "react-helmet" // Importa Helmet
import { useTranslation } from "react-i18next"
import ChatbotEmbed from "../../../components/popups/chatbot-embed/ChatbotEmbedPopup"
import ChatbotSource from "../../../components/popups/chatbot-poulin/ChatbotPoulinPopup"
import CustomVisionPopup from "../../../components/popups/custom-vision/CustomVisionPopup"
import Popup from "../../../components/popups/Popup"
import "./Pulling.css"

const clearAllCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim()
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  })
  window.location.href = "/login"
}

const Pulling = () => {
  const { t } = useTranslation() // Access translation function
  const [activePopup, setActivePopup] = useState(null)

  function setCookie(name, value, days) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = "expires=" + date.toUTCString()
    document.cookie = name + "=" + value + ";" + expires + ";path=/"
  }

  setCookie("selectedLanguage", "en", 30)

  const openPopup = (popupType) => {
    setActivePopup(popupType)
  }

  const closePopup = () => {
    setActivePopup(null)
  }

  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </Helmet>

      <Popup isOpen={activePopup === "customVision"} onClose={closePopup}>
        <CustomVisionPopup onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "chatbot"} onClose={closePopup}>
        <ChatbotEmbed onClose={closePopup} />
      </Popup>

      <Popup isOpen={activePopup === "chatbotsource"} onClose={closePopup}>
        <ChatbotSource onClose={closePopup} />
      </Popup>

      <div className="home-container">
        <h1 className="ourservice">Poulin Grain </h1>
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

          <div className="feature-item">
            <div
              className="image-container"
              onClick={() => openPopup("chatbotsource")}
            >
              <img
                src="../images/chatbot.webp"
                alt={t("home.features.chatbot.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>Sales Reader</h3>
                <div className="subtitle"> </div>
              </div>
            </div>

            <div className="actions hidden">
              <button className="btn">
                <i className="fas fa-users"></i> {/* Icona per "Users" */}
                <div className="tooltip">Users</div> {/* Tooltip per Users */}
              </button>
              <button className="btn">
                <i className="fas fa-cogs"></i>{" "}
                {/* Icona per "Prompt settings" */}
                <div className="tooltip">Prompts</div>{" "}
                {/* Tooltip per Prompt settings */}
              </button>
              <button className="btn">
                <i className="fas fa-history"></i>{" "}
                {/* Icona per "Unliked conversation" */}
                <div className="tooltip">Unliked</div>{" "}
                {/* Tooltip per Unliked conversation */}
              </button>
            </div>
          </div>

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
                <div className="subtitle"></div>
              </div>
            </div>
          </div>
        </section>
        <button href onClick={clearAllCookies} className="logout-link">
          Logout
        </button>
      </div>

      {/* Link Logout */}
    </div>
  )
}

export default Pulling
