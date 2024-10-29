import React from "react"
import "./Navbar.css" // Assicurati che questo percorso sia corretto

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">My Logo</div>

      <div className="language-selector">
        <button>EN</button>
        <button>ES</button>
        <button>IT</button>
      </div>
    </nav>
  )
}

export default Navbar
