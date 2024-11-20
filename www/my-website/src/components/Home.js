import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import "./Home.css"
import Howworks from "./howworks/HowWorks"
import Info from "./info/Info"
import Landing from "./landing/Landing"
import NavBar from "./navbar/Navbar"
import ChatbotPopup from "./popups/chatbot/ChatbotPopup"
import CustomVisionPopup from "./popups/customVision/CustomVisionPopup"
import Popup from "./popups/Popup"
import PredictivePopup from "./popups/predictive/PredictivePopup"
import Technologies from "./technologies/Technologies"
const Home = () => {
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
        <ChatbotPopup onClose={closePopup} />
      </Popup>
      <Popup isOpen={activePopup === "predictive"} onClose={closePopup}>
        <PredictivePopup onClose={closePopup} />
      </Popup>
      <div className="home-container">
        <header className="header">
          <h1 className="logo">Human in the loop</h1>
        </header>

        <h1 className="ourservice">{t("home.service_heading")}</h1>
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
                <h3>{t("home.features.chatbot.title")}</h3>
                <div className="subtitle">
                  {t("home.features.chatbot.subtitle")}
                </div>
              </div>
            </div>
          </div>

          <div className="feature-item" onClick={() => openPopup("predictive")}>
            <div className="image-container">
              <img
                src="../images/predictive.webp"
                alt={t("home.features.predictive.title")}
                className="feature-image"
              />
              <div className="overlay">
                <h3>{t("home.features.predictive.title")}</h3>
                <div className="subtitle">
                  {t("home.features.predictive.subtitle")}
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
        <h1 className="techweuse">{t("home.technologies_heading")}</h1>
        <Technologies />
      </div>
    </div>
  )
}

export default Home
