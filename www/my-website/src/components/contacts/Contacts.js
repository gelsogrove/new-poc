import React, { useEffect } from "react"
import "./Contacts.css"

const Contacts = () => {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="contact-section">
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/gelsogrove/30min?background_color=f1c26b&text_color=000000"
        style={{ minWidth: "320px", height: "730px" }}
      ></div>
    </div>
  )
}

export default Contacts
