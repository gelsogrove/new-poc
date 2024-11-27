import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"
import "./i18n"
import Footer from "./www/components/Footer/Footer"
import AllProducts from "./www/pages/customers/allproducts/AllProducts"
import Broker from "./www/pages/customers/broker/Broker"
import Pulling from "./www/pages/customers/pulling/Pulling"
import Home from "./www/pages/home/Home"
import Login from "./www/pages/login/Login"

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
    if (username.toLowerCase() === "admin" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/; path=/"
    }
    if (username.toLowerCase() === "poulin" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/pulling; path=/"
    }

    if (username.toLowerCase() === "broker" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/broker; path=/"
    }

    if (username.toLowerCase() === "all" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/all; path=/"
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
            path="/pulling"
            element={isAuthenticated ? <Pulling /> : <Navigate to="/login" />}
          />

          <Route
            path="/broker"
            element={isAuthenticated ? <Broker /> : <Navigate to="/broker" />}
          />

          <Route
            path="/all"
            element={isAuthenticated ? <AllProducts /> : <Navigate to="/all" />}
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
