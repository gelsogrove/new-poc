import React from "react"
import "./BackgroundVideo.css" // Aggiungi il CSS per il video di sfondo

const BackgroundVideo = () => {
  return (
    <div className="video-background">
      <video autoPlay loop muted>
        <source src="../images/background.mp4" type="video/mp4" />
        Il tuo browser non supporta i video.
      </video>
    </div>
  )
}

export default BackgroundVideo
