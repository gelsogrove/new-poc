import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Login from "./components/Login/Login"
import Navbar from "./components/Navbar"
import Services from "./components/Services"
import "./i18n" // Import i18n setup

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "wip") {
      setIsAuthenticated(true) // Update authentication status
    }
  }

  // Redirect to home after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/") // Redirect to home after successful login
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="app-container">
      <div className="main-content">
        {isAuthenticated && <Navbar />}

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/contact"
            element={isAuthenticated ? <Contact /> : <Navigate to="/login" />}
          />
          <Route
            path="/services"
            element={isAuthenticated ? <Services /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
