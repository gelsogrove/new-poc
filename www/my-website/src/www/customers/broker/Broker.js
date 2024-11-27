import React, { useState } from "react"
import ChatbotBrokerPopup from "../../popups/chatbot-broker/ChatbotBrokerPopup"
import Popup from "../../popups/Popup"
import "./Broker.css"

const Broker = () => {
  const [activePopup, setActivePopup] = useState(false)

  const openPopup = () => {
    setActivePopup(true)
  }

  const closePopup = () => {
    setActivePopup(null)
  }
  return (
    <div>
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
                <h3>Broker</h3>
                <div className="subtitle"> </div>
              </div>
            </div>
          </div>
        </section>{" "}
      </div>
    </div>
  )
}

export default Broker
