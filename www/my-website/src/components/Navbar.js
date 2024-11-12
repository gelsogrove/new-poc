import React from "react"
import i18n from "../i18n" // Ensure i18n is configured
import "./Navbar.css" // Make sure this path is correct

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="language-selector">
        {/* Italian Language Button */}
        <button onClick={() => i18n.changeLanguage("it")} data-tooltip="ITA">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/italy-flag-icon.png"
            alt="Italian"
          />
        </button>
        {/* Spanish Language Button */}
        <button onClick={() => i18n.changeLanguage("es")} data-tooltip="ESP">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/spain-country-flag-icon.png"
            alt="Spanish"
          />
        </button>
        {/* English Language Button */}
        <button onClick={() => i18n.changeLanguage("en")} data-tooltip="ENG">
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
