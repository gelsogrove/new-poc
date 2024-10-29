import React from "react"
import { Route, Routes } from "react-router-dom"
import "./App.css"
import Contact from "./components/Contact" // Assicurati che questo componente esista
import Footer from "./components/Footer" // Assicurati che questo componente esista
import Home from "./components/Home" // Assicurati che questo componente esista
import Services from "./components/Services" // Assicurati che questo componente esista

const App = () => {
  return (
    <div className="app-container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
