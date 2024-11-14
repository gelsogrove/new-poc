import React, { useEffect, useState } from "react"
import i18n from "../../i18n"
import "./Navbar.css"

const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  useEffect(() => {
    const browserLanguage = navigator.language.split("-")[0]

    const supportedLanguages = ["it", "es", "en"]
    const defaultLanguage = supportedLanguages.includes(browserLanguage)
      ? browserLanguage
      : "en"
    i18n.changeLanguage(defaultLanguage)
    setSelectedLanguage(defaultLanguage)
  }, [])

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language)
    setSelectedLanguage(language)
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
