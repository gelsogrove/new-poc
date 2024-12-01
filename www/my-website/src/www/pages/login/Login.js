// components/Login.js

import React, { useState } from "react"
import "./Login.css" // Importa questo file di stile che creeremo dopo

function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(username, password) // Passiamo le credenziali alla funzione di login
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <br />
    </div>
  )
}

export default Login
