import React, { useEffect, useState } from "react"
import i18n from "../../i18n"
import "./Navbar.css"

// Funzione per impostare un cookie
function setCookie(name, value, days) {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = "expires=" + date.toUTCString()
  document.cookie = name + "=" + value + ";" + expires + ";path=/"
}

// Funzione per ottenere un cookie
function getCookie(name) {
  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  useEffect(() => {
    const supportedLanguages = ["it", "es", "en"]
    let language = getCookie("selectedLanguage")

    if (!language) {
      const browserLanguage = navigator.language.split("-")[0]
      language = supportedLanguages.includes(browserLanguage)
        ? browserLanguage
        : "en"
    }

    i18n.changeLanguage(language)
    setSelectedLanguage(language)
  }, [])

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language)
    setSelectedLanguage(language)
    setCookie("selectedLanguage", language, 30) // Salva la lingua per 30 giorni
  }

  return (
    <nav className="navbar">
      <div className="language-selector">
        {/* Italian Language Button */}
        <button
          onClick={() => handleLanguageChange("it")}
          className={selectedLanguage === "it" ? "selected" : ""}
          data-tooltip="ITA"
        >
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/italy-flag-icon.png"
            alt="Italian"
          />
        </button>
        {/* Spanish Language Button */}
        <button
          onClick={() => handleLanguageChange("es")}
          className={selectedLanguage === "es" ? "selected" : ""}
          data-tooltip="ESP"
        >
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/spain-country-flag-icon.png"
            alt="Spanish"
          />
        </button>
        {/* English Language Button */}
        <button
          onClick={() => handleLanguageChange("en")}
          className={selectedLanguage === "en" ? "selected" : ""}
          data-tooltip="ENG"
        >
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/united-kingdom-flag-icon.png"
            alt="English"
          />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
