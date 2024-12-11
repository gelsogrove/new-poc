import React, { useState } from "react"
import Navbar from "../../../components/navbar/Navbar"
import Popup from "../../../components/popups/Popup"
import ChatbotBrokerPopup from "../../../components/popups/chatbot-broker/ChatbotBrokerPopup"
import "./Broker.css"

const Broker = () => {
  const [activePopup, setActivePopup] = useState(false)

  const clearAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
    })
    window.location.href = "/login"
  }

  const openPopup = () => {
    setActivePopup(true)
  }

  const closePopup = () => {
    setActivePopup(null)
  }
  return (
    <div>
      <Navbar />
      <Popup isOpen={activePopup} onClose={closePopup}>
        <ChatbotBrokerPopup onClose={closePopup} />
      </Popup>

      <div className="home-container">
        <h1 className="ourservice">Broker </h1>
        <br />
        <section className="features">
          <div className="feature-item" onClick={() => openPopup()}>
            <div className="image-container">
              <img
                src="../images/chatbot.webp"
                alt="Broker"
                className="feature-image"
              />
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

export default Broker
