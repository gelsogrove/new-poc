import React, { useEffect, useState } from "react"
import "./CustomVisionPopup.css"

const phrases = [
  {
    text: "We have created a Custom Vision solution capable of identifying any kind of scratch on the car body",
    image: "images/scratch.png",
    duration: 6500,
  },
  {
    text: "This solution is capable to run an OCR scan and get any ID number, as shown below",
    image: "images/vin.png",
    duration: 6500,
  },
  {
    text: "It can generate real-time statistics and identify times with a higher concentration of defects during the day",
    image: "images/statistics.png",
    duration: 6500,
  },
  {
    text: "This solution can be customized to detect different types of issues across various industries, like automotive, manufacturing, and logistics, making it adaptable for each specific use.",
    duration: 6000,
  },
]

const CustomVisionPopup = ({ onClose }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false) // Stato per il controllo del video
  const [fadeClass, setFadeClass] = useState("fade-in")
  const [touchStartX, setTouchStartX] = useState(0)

  useEffect(() => {
    if (currentPhraseIndex < phrases.length) {
      setFadeClass("fade-in")

      if (currentPhraseIndex < phrases.length - 1) {
        const fadeOutTimeout = setTimeout(() => {
          setFadeClass("fade-out")
        }, phrases[currentPhraseIndex].duration - 1500)

        const changePhraseTimeout = setTimeout(() => {
          setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
        }, phrases[currentPhraseIndex].duration)

        return () => {
          clearTimeout(fadeOutTimeout)
          clearTimeout(changePhraseTimeout)
        }
      } else {
        // Mostra il video al termine delle frasi
        setShowVideo(true)
      }
    }
  }, [currentPhraseIndex])

  const currentPhrase = phrases[currentPhraseIndex]

  const handleDotClick = (index) => {
    setCurrentPhraseIndex(index)
    setFadeClass("fade-in")
    setShowVideo(false) // Nasconde il video quando si passa tra le frasi
  }

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    if (touchStartX - touchEndX > 50) {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
    } else if (touchEndX - touchStartX > 50) {
      setCurrentPhraseIndex((prevIndex) =>
        prevIndex === 0 ? phrases.length - 1 : prevIndex - 1
      )
    }
    setFadeClass("fade-in")
  }

  return (
    <div
      className="popup"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <div className="video-container">
        {!showVideo ? (
          currentPhrase && (
            <div
              key={currentPhraseIndex}
              className={`phrase-container ${fadeClass}`}
            >
              <div className="phrase-text">{currentPhrase.text}</div>
              {currentPhrase.image && (
                <img
                  src={currentPhrase.image}
                  alt="associated"
                  className="phrase-image"
                />
              )}
            </div>
          )
        ) : (
          <iframe
            width="100%"
            height="480"
            src="https://www.youtube.com/embed/ZriGr7PH-Mc?autoplay=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
      </div>

      <div className="dots-container">
        {phrases.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentPhraseIndex ? "active" : ""}`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default CustomVisionPopup
