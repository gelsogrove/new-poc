import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"

import DemoPage from "./components/demopage/DemoPage"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Login from "./components/login/Login"
import Pulling from "./components/pulling/Pulling"
import "./i18n" // Import i18n setup

const App = () => {
  // Funzione per leggere i cookie
  const getCookieValue = (cookieName) => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
    return cookie ? cookie.split("=")[1] : null
  }

  // Stato per l'autenticazione
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Controlla subito se l'utente è autenticato (presenza del cookie)
    return document.cookie.includes("isAuthenticated=true")
  })

  // Gestione login
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/; path=/"
    }
    if (username === "pulling" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/pulling; path=/"
    }
  }

  // Hook per navigazione
  const navigate = useNavigate()

  // Effettuare il redirect dopo il login
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getCookieValue("redirect") || "/"
      if (window.location.pathname !== "/demo") {
        // Naviga verso la pagina di redirect
        navigate(redirectPath, { replace: true })
      }
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="app-container">
      <div className="main-content">
        {isAuthenticated}

        <Routes>
          <Route
            path="/demo"
            element={isAuthenticated ? <DemoPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/pulling"
            element={isAuthenticated ? <Pulling /> : <Navigate to="/login" />}
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
