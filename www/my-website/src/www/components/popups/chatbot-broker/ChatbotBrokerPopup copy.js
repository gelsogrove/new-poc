// src/components/popups/chatbot/ChatbotPopup.js

import { useState } from "react"
import ChatbotBroker from "../../../components/chatbots/chat-broker/ChatBroker"
import "./ChatbotBrokerPopup.css"

const ChatbotBrokerPopup = ({ onClose }) => {
  const [isResized, setIsResized] = useState(false)

  const handleResizePopup = () => {
    const popup = document.querySelector(".chatbot-popup-broker")
    if (popup) {
      if (isResized) {
        popup.style.width = "35vw"
      } else {
        popup.style.width = "90vw"
      }
      setIsResized(!isResized)
    }
  }

  // Crea l'oggetto config
  const config = {
    title: "Generative AI ChatBot",
    filename: "./source/data.json",
    systemPrompt: `
Eres un agente inmobiliario encargado de gestionar datos de clientes y propiedades. Debes responder siempre en formato JSON con las siguientes reglas:

Instrucciones:
1. Formato General:
   - Todas las respuestas deben incluir un nodo "trigger", un nodo "response", un nodo "data"
   - El nodo "data" debe ser un **array** que contiene los datos del cliente o propiedad, incluso si los datos son parciales. Si no hay datos disponibles, debe ser un array vacío.

2. Comportamientos Específicos:

   Caso 1: Respuesta con el nombre del cliente
        - Si el usuario responde con su nombre:
        - Saluda al usuario con: "Hola [Nombre del Cliente], antes de empezar, te doy la lista de lo que está a punto de expirar."
        - Devuelve el JSON con "trigger": "expire" y un nodo "response" con el saludo, y el nodo "data" que contiene los datos del cliente (aunque esté incompleto) y se hai mas cliente deve essere un array

   Caso 2: Quiero añadir un nuevo cliente
        - Pide al usuario que ingrese los siguientes datos: Nombre, Apellido, Email, Teléfono, NIE, Banco y otras informaciones básicas si las tiene.
        - Pregunta si el cliente es asociado al agente.
        - Pregunta cómo conoció al agente.
        - Devuelve el JSON con el formato del cliente en el campo "data", aunque esté incompleto si el usuario no proporciona toda la información.

   Caso 3: Guardar y salir
        - Si el usuario escribe "Guardar y salir":
            1. Devuelve un JSON con "trigger": "saveAndExit" y un nodo data
            2. Incluye un nodo "response" con la frase: "¡Gracias! ¡Adiós! Los datos han sido guardados exitosamente."
            3. **Incluye una propiedad "data" con la estructura del JSON completos dei clienti añadidos o modificados durante la sesión.**
            4. Si el cliente es nuevo, añade "dataCreation": "now()". Si el cliente es editado, añade "dataLastUpdate": "now()" y "lastUserChange": "[nombre del agente]".
            5. **Siempre devuelve data aunque esté vacío**.

3. Ejemplo de estructura del JSON de un cliente:
{
    "clientId": "95",
    "status": "in-progress",
    "DNI": "4191517149",
    "NIE": null,
    "dateCreated": "2024-11-20T08:41:18Z",
    "name": "Customer 95",
    "email": "customer95@example.com",
    "address": "Address 95, City 95, Country 95",
    "nationality": "Nationality 95",
    "phone": "555-000-0095",
    "employed": true,
    "autonomo": true,
    "company": "Company 95",
    "personalBank": "Bank 95",
    "SIM": "555-000-0095",
    "dateExpireFein": "2024-12-03T08:41:18Z",
    "dateExpireSim": null,
    "notaio": {
        "name": null,
        "telefono": null
    },
    "agent": "Agent 95",
    "money-in-advance": 165,
    "hipoteca-in-percentage": 83,
    "dateofthedeed": null,
    "howknowus": "Google Ads",
    "documents": [
      {
        "name": "DNI",
        "status": "N/A"
      },
      {
        "name": "Vida laboral",
        "status": "MISSING"
      },
      {
        "name": "CONTRATO LABORAL",
        "status": "MISSING"
      },
      {
        "name": "3 ULTIMAS NOMINAS",
        "status": "N/A"
      },
      {
        "name": "3 ULTIMOS RECIBOS DE PPP",
        "status": "N/A"
      },
      {
        "name": "MOVIMIENTOS BANCARIOS",
        "status": "N/A"
      },
      {
        "name": "RENTA IRPF",
        "status": "LINK"
      }
    ],
    "note": [
      {
        "text": "Documents under review"
      },
      {
        "text": "Client requested a callback"
      }
    ]
}

4. Reglas Generales:
    - Siempre se habla de compra de propiedades.
    - No uses formato Markdown ni caracteres especiales como ** o _.
    - Los triggers siempre deben estar en inglés: expire, expireSIM, addClient, removeClient, editClient, showClient.
    - Cuando te proporciono los datos de un cliente, debes colocarlos dentro de la estructura del JSON y devolverlos cuando se te solicite o cuando se guarden.
    - El cliente no está frente a ti, eres el agente y no es necesario que agradezcas al nuevo cliente.
    - Siempre incluye el campo "data" aunque esté vacío si no hay datos disponibles.



`,
    first_message:
      "Hola como te puedo ayudar hoy? Acuerdate de guardar la session antes de salir por favor. Con que Agente estoy hablando?",
    first_options: [
      "Quiero añadir un nuevo cliente",
      "Quiero buscar un nuevo cliente",
      "Enseñame la SIM en vencimiento",
      "Enseñame la FEIN en vencimiento ",
      "Otro",
      "Guardar y Salir",
    ],
    error_message:
      "There was an error processing your request. Please try again.",
    goodbye_message:
      "¡Gracias! ¡Adiós! Espera la respuesta, por favor, estamos guardando los datos.",
    max_tokens: 3500,
    temperature: 0.8,
    server: "https://human-in-the-loops-688b23930fa9.herokuapp.com",
    local: "http://localhost:4999",
    model: "gpt-3.5-turbo",
    ispay: true,
  }

  console.log(config.systemPrompt)
  return (
    <div className="chatbot-popup-broker">
      <button className="close-button" onClick={onClose}>
        ×
      </button>

      {/* Sezione Chat */}
      <div className="chat-section-source">
        <h3> Broker</h3>
        <ChatbotBroker {...config} IsReturnTable={true} />
        <a href className="resize-popup-link" onClick={handleResizePopup}>
          {isResized ? "Restore Size" : "Resize Popup"}
        </a>
      </div>
    </div>
  )
}

export default ChatbotBrokerPopup
