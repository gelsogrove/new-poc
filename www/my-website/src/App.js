/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"

import DemoPage from "./components/demopage/DemoPage"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Login from "./components/login/Login"
import NavBar from "./components/navbar/Navbar"
import "./i18n" // Import i18n setup

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check cookie for authentication status
    return document.cookie.includes("isAuthenticated=true")
  })
  const navigate = useNavigate()

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "wip") {
      setIsAuthenticated(true)
      console.log("Login successful, isAuthenticated set to true")
      document.cookie = "isAuthenticated=true; path=/"
    } else {
      console.log("Login failed, incorrect credentials")
    }
  }

  // Redirect to home after successful login
  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated)
    console.log("Cookies:", document.cookie)
    // Redirect only if navigating from login
    if (isAuthenticated && window.location.pathname === "/login") {
      console.log("Redirecting to home")
      navigate("/")
    }
  }, [isAuthenticated])

  return (
    <div className="app-container">
      <div className="main-content">
        {isAuthenticated && <NavBar />}

        <Routes>
          <Route
            path="/demo"
            element={isAuthenticated ? <DemoPage /> : <Navigate to="/login" />}
          />
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
