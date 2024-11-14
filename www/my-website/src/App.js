import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"

import Footer from "./components/Footer"
import Home from "./components/Home"
import Login from "./components/login/Login"
import NavBar from "./components/navbar/Navbar"
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
        {isAuthenticated && <NavBar />}

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
