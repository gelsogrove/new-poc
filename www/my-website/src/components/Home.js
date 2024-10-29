import React from "react"
import "./Home.css"; // Assicurati che questo file CSS esista

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1>Welcome to Our AI Consulting</h1>
        <p> SMART Solutions</p>
      </header>
      <section className="features">
        <div className="feature-item">
          <div className="image-container">
            <img
              src="../images/customvision.png" // Assicurati che il percorso sia corretto
              alt="Custom Vision"
              className="feature-image"
            />
            <div className="overlay">
              <h3>Custom Vision</h3>
              <p>
                Enhance your quality control process with AI vision solutions.
              </p>
            </div>
          </div>
        </div>
        <div className="feature-item">
          <div className="image-container">
            <img
              src="../images/chatbot.jpg"
              alt="Custom Chatbots"
              className="feature-image"
            />
            <div className="overlay">
              <h3>Custom Chatbots</h3>
              <p>Transform your company with Intelligent AI Conversations.</p>
            </div>
          </div>
        </div>
        <div className="feature-item">
          <div className="image-container">
            <img
              src="../images/voiceassistance.png" // Assicurati che il percorso sia corretto
              alt="Voice Assistance"
              className="feature-image"
            />
            <div className="overlay">
              <h3>Voice Assistance</h3>
              <p>Enhance customer experience with voice technology.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
