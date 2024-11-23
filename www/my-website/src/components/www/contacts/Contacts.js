import React, { useEffect } from "react"
import "./Contacts.css"

const Contacts = () => {
  const calendlyLinks = [
    {
      language: "en",
      url: "https://calendly.com/gelsogrove/30min?background_color=f1c26b&text_color=000000",
      text: "Let's talk about it",
    },
    {
      language: "es",
      url: "https://calendly.com/gelsogrove/30min?background_color=f1c26b&text_color=000000",
      text: "Hablemos de eso",
    },
    {
      language: "it",
      url: "https://calendly.com/gelsogrove/30min?background_color=f1c26b&text_color=000000",
      text: "Parliamone",
    },
  ]

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
  }

  const getCalendlyData = () => {
    const language = getCookie("selectedLanguage") || "en"
    const link = calendlyLinks.find((link) => link.language === language)
    return link ? { url: link.url, text: link.text } : { url: "", text: "" }
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="contact-section">
      <div
        className="calendly-inline-widget"
        data-url={getCalendlyData().url}
        style={{ minWidth: "320px", height: "730px" }}
      ></div>
    </div>
  )
}

export default Contacts
