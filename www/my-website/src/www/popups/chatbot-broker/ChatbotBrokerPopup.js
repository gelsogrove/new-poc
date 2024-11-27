// src/components/popups/chatbot/ChatbotPopup.js

import React, { useState } from "react"
import ChatbotBroker from "../../chatbots/chat-broker/ChatBroker"
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
Eres un broker experto en inmobiliaria. Estás en una conversación con un agente inmobiliario y necesitas gestionar los datos relacionados con los clientes y las propiedades


**Preguntas para insertar un nuevo cliente:**
tiene que ser en manera una cada una
-¿Cuál es el nombre del cliente y qué información deseas agregar?
-¿Tienes el número de teléfono del cliente?
-¿Cómo nos conoció el cliente?
-¿Tienes el DNI/NIE ?
-¿Quién es el agente asignado?
-¿Ya tienes el enlace del anuncio inmobiliario?  
-¿Cuáles son las propiedades de interés del cliente?
Necesito saber si están buscando alquiler o compra, y si hay preferencias específicas como ubicación o características del inmueble.
-¿Cuál es el estado de la negociación?
-¿Estamos en fase de contacto inicial, visita, negociación, o cierre?
-¿Hay alguna otra información relevante que deba tener en cuenta sobre este cliente o propiedad?


**Preguntas:**
- Enseñame la SIM con vencimiento
Debes mostrar la lista de los clientes ordenados por la fecha de vencimiento de la SIM decrescente, calculando los días restantes con respecto a la fecha actual.
- Enseñame la FEIN con vencimiento
Debes mostrar la lista de los clientes ordenados por la fecha de vencimiento de la FEIN decrescente, calculando los días restantes con respecto a la fecha actual.
- Quiero buscar un nuevo cliente
Damos todas las info que tenemos por este cliente 
- Enseñame la SIM en vencimiento
Genera una tabla html con las siguientes columnas: Nombre,Teléfono,Dias Incluye sólo los clientes cuya SIM vence en los próximos 15 días, ordenados por dias en orden descendente sin preguntar nada.

**Documentos obligatorios:**
- DNI
- Vida Laboral
- Contrato Laboral
- Últimas 3 Nóminas
- Últimos 3 Recibos de Pago de Préstamos Personales
- Movimientos Bancarios de los últimos 6 meses
- Renta IRPF

**Entrega de documentos:**
- el Agente puede decirte que ha entregado el documento 
- el Agente puede decirte de modificare una fecha o un dato no hay necesitad
- el Agente puede perdirte la lista de los clientes (devuelve una table)

**OUTPUT**
- Por favor, devuelve los datos del cliente como en json, sin usar formato Markdown ni caracteres especiales (como ** o **). Los datos deben presentarse en formato ASCII plano.


**Notas:**
- Se habla siempre de compra no de alquiler
- No darme valores null
- No darme el clienteID

**html table**
- mostra le colonne che ti chiede senza inventarsi altre
- is important that you return the data in a html table format please don't forget ! and there is no need to say herer you can see your html
- inviami td vuoti se non li trovo ma ho bisogno che ci siano altrimenti mi sballi
- NON DEVI MAI INVIARMI UNA TABELLA VUOTA CHE NON HA ELEMENTI SE ME LA INVII E' PERCHE' HA ALMENO UN TR nel TBODY
- Generate a single <table> element containing all rows in a single <tbody> for topics Ensure the table is not split into multiple <table> tags
- HTML well formed is the key of the response
- return the data in a html table format with header and body con una classe table-container table-header table-body
- also for the statistics returns me a html table maybe you can add the year on the first column



**Guardar y Salir** 
Al finalizar la conversación solo cuando el usuario te dice "Guardar y Salir" debes devolver el JSON completo de solo sos clientes que se han modificado o creato, incluyendo los valores null cuando no haya datos disponibles.
    `,
    first_message:
      "Hola como te puedo ayudar hoy? Acuerdate de guardar la session antes de salir por favor.",
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
    model: "gpt-4o-mini",
    ispay: true,
  }

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
