import React, { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"
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
    return getCookieValue("isAuthenticated") === "true"
  })

  // Hook per navigazione
  const navigate = useNavigate()

  const handleLogin = (username, password) => {
    if (username.toLowerCase() === "admin" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/home; path=/"
    } else if (username.toLowerCase() === "poulin" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/pulling; path=/"
    } else if (username.toLowerCase() === "broker" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/broker; path=/"
    } else if (username.toLowerCase() === "all" && password === "wip") {
      setIsAuthenticated(true)
      document.cookie = "isAuthenticated=true; path=/"
      document.cookie = "redirect=/all; path=/"
    } else {
      console.log("Invalid login attempt")
      setIsAuthenticated(false)
    }
  }

  // Effettuare il redirect dopo il login
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getCookieValue("redirect") || "/home"

      if (window.location.pathname !== "redirectPath") {
        navigate(redirectPath, { replace: true })
      }
    } else {
      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true })
      }
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="app-container">
      <div className="main-content">
        <Routes>
          <Route
            path="/pulling"
            element={isAuthenticated ? <Pulling /> : <Navigate to="/login" />}
          />
          <Route
            path="/broker"
            element={isAuthenticated ? <Broker /> : <Navigate to="/login" />}
          />
          <Route
            path="/all"
            element={
              isAuthenticated ? <AllProducts /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
