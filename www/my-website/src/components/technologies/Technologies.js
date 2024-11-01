import React from "react"
import "./Technologies.css"

const Technologies = () => {
  const logos = [
    {
      src: "../images/logos/Python.svg", // Assicurati che il percorso sia corretto
      alt: "python",
    },
    {
      src: "https://images.ctfassets.net/2vbtnveccz5s/5IT6UdLarkFUzbl6UkCWQn/b7a44a9701ba61735fd1ced91a56c022/OpenAI_Logo.svg.png",
      alt: "OPENAI",
    },
    {
      src: "https://cdn.prod.website-files.com/646dd1f1a3703e451ba81ecc/64777c3e071ec953437e6950_logo.svg",
      alt: "Ultralytics",
    },
    {
      src: "../images/logos/google-colab.webp",
      alt: "Google Colab",
    },
    {
      src: "../images/logos/langchain.png",
      alt: "LangChain",
    },
    {
      src: "../images/logos/skikit-learn.png", // Assicurati che il percorso sia corretto
      alt: "SCi-kitlearn",
    },
    {
      src: "../images/logos/nodejs.svg", // Assicurati che il percorso sia corretto
      alt: "nodeJs",
    },

    // https://eleks.com/services/data-science-services/
  ]

  return (
    <div className="technologies-container">
      <br />
      <div className="row">
        {logos.map((logo, index) => (
          <div className="technology-card" key={index}>
            <img src={logo.src} alt={logo.alt} className="tech-logo" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Technologies
