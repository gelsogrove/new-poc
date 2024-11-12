import React from "react"
import "./Navbar.css" // Make sure this path is correct

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/contact" className="contact-link"></a>

      <div className="language-selector">
        <button data-tooltip="ITA">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/italy-flag-icon.png"
            alt="Italian Flag"
          />
        </button>
        <button data-tooltip="ESP">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/spain-country-flag-icon.png"
            alt="Spanish Flag"
          />
        </button>
        <button data-tooltip="ENG">
          <img
            src="https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/united-kingdom-flag-icon.png"
            alt="English Flag"
          />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
