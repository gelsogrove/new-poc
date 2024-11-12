import React, { useEffect, useState } from "react"
import "./Predictive.css"

const phrases = [
  {
    text: "<b>AI predictive maintenance</b> doesn’t just watch fixed limits on parameters; it intelligently analyzes data to detect possible issues in real time, for instance when temperature increase shortly, or when pressure shows unusual changes that could indicate parts are wearing out.",
    image: "images/grafana_streamset_animation.gif",
    duration: 20500,
  },
]

const PredictivePopup = ({ onClose }) => {
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
      className="popupPredictive"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      <div key={currentPhraseIndex} className={`phrase-container ${fadeClass}`}>
        <div
          className="phrase-text-prediction"
          dangerouslySetInnerHTML={{ __html: currentPhrase.text }}
        ></div>
        {currentPhrase.image && (
          <img
            src={currentPhrase.image}
            alt="associated"
            className="phrase-image"
          />
        )}
      </div>
    </div>
  )
}

export default PredictivePopup
