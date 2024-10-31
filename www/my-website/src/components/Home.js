import React from "react"
import "./Home.css" // Assicurati che questo file CSS esista
import Info from "./info/Info"
import Landing from "./landing/Landing"
import Technologies from "./technologies/Technologies"

const Home = () => {
  return (
    <div>
      <div className="home-container">
        <header className="header">
          <p> AI Solutions</p>
        </header>
        <section className="features">
          <div className="feature-item">
            <div className="image-container">
              <img
                src="../images/dalle.webp" // Assicurati che il percorso sia corretto
                alt="Custom Vision"
                className="feature-image"
              />
              <div className="overlay">
                <h3>Custom Vision</h3>
                <p>
                  <div className="subtitle">
                    Enhance your quality control process with AI vision
                    solutions.
                  </div>
                </p>
              </div>
            </div>
          </div>
          <div className="feature-item">
            <div className="image-container">
              <img
                src="../images/chatbot.webp"
                alt="Custom Chatbots"
                className="feature-image"
              />
              <div className="overlay">
                <h3>Custom Chatbots</h3>
                <p>
                  <div className="subtitle">
                    Transform your company with Intelligent AI Conversations.
                  </div>
                </p>
              </div>
            </div>
          </div>

          <div className="feature-item">
            <div className="image-container">
              <img
                src="../images/generativeAI.webp" // Assicurati che il percorso sia corretto
                alt="Voice Assistance"
                className="feature-image"
              />
              <div className="overlay">
                <h3>Generative AI</h3>
                <p>
                  <div className="subtitle">
                    Generate report, invoices, contract, agreements, quotes
                  </div>
                </p>
              </div>
            </div>
          </div>
        </section>
        <br />

        <Landing />
      </div>

      <Info />
      <Technologies />
      {/*  <ChatBase /> */}
    </div>
  )
}

export default Home
