import React, { useState } from "react"
import {
  categories,
  dateFields,
  formatToEuro,
  moneyFields,
  translateKey,
} from "./helpers"

const Generic = ({ msg }) => {
  const { response, data } = msg

  const [hideEmptyFields, setHideEmptyFields] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    "Datos personales": true, // Mantieni sempre aperta la prima sezione
  })
  const [allSectionsOpen, setAllSectionsOpen] = useState(false) // Stato per il toggle di tutte le sezioni

  const toggleHideEmptyFields = () => {
    setHideEmptyFields((prev) => !prev)
  }

  const toggleAllSections = () => {
    const newState = !allSectionsOpen // Inverti lo stato
    setAllSectionsOpen(newState)
    setExpandedSections(
      Object.keys(categories).reduce((acc, category) => {
        acc[category] = category === "Datos personales" || newState
        return acc
      }, {})
    )
  }

  const handleToggleSection = (category) => {
    if (category === "Datos personales") return // Evita il toggle su "Datos personales"
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handlePrint = (index) => {
    const dataContainer = document.querySelectorAll(".data-container")[index] // Seleziona il div "data-container" in base all'indice

    if (dataContainer) {
      const printWindow = window.open("", "_blank", "width=800,height=600")
      printWindow.document.open()
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              /* Aggiungi qui eventuali stili necessari */
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .progress-bar { height: 20px; background-color: green; }
            </style>
          </head>
          <body>
            ${dataContainer.outerHTML} <!-- Copia il contenuto HTML del div -->
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    } else {
      alert("Nessun contenuto disponibile per la stampa.")
    }
  }

  const handleCheckMail = () => {
    alert("Verificando correo...")
  }

  const handleOpenFolder = (link) => {
    if (link) {
      window.open(link, "_blank")
    } else {
      alert("No hay enlace disponible para la carpeta.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date)
    } catch (error) {
      console.error("Fecha inválida:", dateString)
      return dateString
    }
  }

  const formatBoolean = (value) => {
    if (typeof value === "boolean") {
      return value ? "SI" : "NO"
    }
    return value
  }

  const getValueOrPlaceholder = (value) =>
    value !== undefined && value !== null && String(value).trim() !== ""
      ? value
      : "-"

  const calculateCompletion = (item) => {
    let completion = 0

    if (item.generatedEmail) completion += 5
    if (item.generatedSIM) completion += 5
    if (item.notaryName) completion += 5
    if (item.agencyOffertMade) completion += 5
    if (item.jobTitle) completion += 5
    if (item.mortgageBank) completion += 5
    if (item.propertyAddress) completion += 5
    if (item.IBANpersonalBank) completion += 5
    if (item.monthlyIncome) completion += 5
    if (item.personalEmail) completion += 5
    if (item.folderDocument) completion += 10
    if (item.propertyPrice) completion += 10

    if (item.dateFeinReceived) completion = Math.max(completion, 90)

    if (item.dataofdeed) {
      const deedDate = new Date(item.dataofdeed)
      const now = new Date()
      if (deedDate < now) {
        completion += 10
      }
    }

    return Math.min(completion, 100)
  }

  const handleFactura = (item) => {
    const invoiceNumber = Math.floor(Math.random() * 1000000) // Numero fattura fittizio
    const currentDate = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) // Data attuale

    const invoiceHTML = `
      <html>
        <head>
          <title>Factura</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
            }
            .invoice-container {
              width: 100%;
              max-width: 600px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 5px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 0;
              color: #555;
            }
            .details, .items {
              margin-bottom: 20px;
            }
            .details h2, .items h2 {
              margin: 0 0 10px 0;
              font-size: 18px;
            }
            .details table, .items table {
              width: 100%;
              border-collapse: collapse;
            }
            .details th, .details td, .items th, .items td {
              text-align: left;
              padding: 8px;
              border: 1px solid #ddd;
            }
            .details th, .items th {
              background-color: #f9f9f9;
            }
            .total {
              margin-top: 20px;
              text-align: right;
              font-size: 18px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>Factura</h1>
              <p>Número de Factura: ${invoiceNumber}</p>
              <p>Fecha: ${currentDate}</p>
            </div>
            <div class="details">
              <h2>Datos del Cliente</h2>
              <table>
                <tr>
                  <th>Nombre</th>
                  <td>${item.name || "Juan Perez"}</td>
                </tr>
                 <tr>
                  <th>Surname</th>
                  <td>${item.surname || "Juan Perez"}</td>
                </tr>
                 <tr>
                  <th>Second Surname</th>
                  <td>${item.secondsurname || "-"}</td>
                </tr>

                <tr>
                  <th>DNI</th>
                  <td>${item.DNI || "12345678X"}</td>
                </tr>
                <tr>
                  <th>Dirección</th>
                  <td>${item.propertyAddress || "Calle Falsa 123, Madrid"}</td>
                </tr>
              </table>
            </div>
            <div class="items">
              <h2>Detalle de la Factura</h2>
              <table>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
                <tr>
                  <td>Servicio de Consultoría</td>
                  <td>1</td>
                  <td>500 €</td>
                  <td>500 €</td>
                </tr>
                <tr>
                  <td>Gestión de Documentación</td>
                  <td>1</td>
                  <td>200 €</td>
                  <td>200 €</td>
                </tr>
                <tr>
                  <td>Impuestos</td>
                  <td>-</td>
                  <td>-</td>
                  <td>21 €</td>
                </tr>
              </table>
            </div>
            <div class="total">
              Total a Pagar: 721 €
            </div>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open("", "_blank", "width=800,height=600")
    printWindow.document.open()
    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <span>{msg.response}</span>
  }

  return (
    <div>
      {response && <p>{response}</p>}
      {data.map((item, index) => {
        const completion = calculateCompletion(item)

        return (
          <div>
            <div key={index} className="data-container">
              <table className="table-custom">
                <tbody>
                  {Object.entries(categories).map(([category, keys]) => {
                    const categoryData = keys
                      .filter((key) => key !== "folderDocument")
                      .map((key) => ({
                        key,
                        value: dateFields.includes(key)
                          ? formatDate(item[key])
                          : formatBoolean(getValueOrPlaceholder(item[key])),
                      }))
                      .filter(({ value }) => !hideEmptyFields || value !== "-")

                    if (categoryData.length === 0 && hideEmptyFields) {
                      return null
                    }

                    const isExpanded = expandedSections[category] || false

                    return (
                      <React.Fragment key={category}>
                        <tr
                          className="category-header"
                          onClick={() => handleToggleSection(category)}
                          style={{
                            cursor:
                              category !== "Datos personales"
                                ? "pointer"
                                : "default",
                          }}
                        >
                          {item.DNI && (
                            <td colSpan={2} className="title-session">
                              <b>
                                {category}
                                {category !== "Datos personales" &&
                                  (isExpanded ? " ▼" : " ▶")}
                              </b>
                            </td>
                          )}
                        </tr>
                        {isExpanded &&
                          categoryData.map(({ key, value }, i) => (
                            <tr key={i}>
                              {item.DNI && <td>{translateKey(key)}</td>}
                              <td
                                className={item.DNI ? "" : "no-background"} // Aggiungi una classe se DNI non è presente
                              >
                                {moneyFields.includes(key)
                                  ? formatToEuro(value)
                                  : value}
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div>
              {item.DNI && (
                <div className="button-container">
                  {/* Barra di completamento */}
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${completion}%` }}
                    ></div>
                    <span className="progress-label">{completion}%</span>
                  </div>
                  <div className="blockButton">
                    {/* Bottoni */}
                    <button
                      onClick={toggleHideEmptyFields}
                      className="toggle-button"
                    >
                      {hideEmptyFields
                        ? "Mostrar campos vacíos "
                        : "Ocultar campos vacíos"}
                    </button>
                    {/*
                  <button onClick={toggleAllSections} className="toggle-button">
                    {allSectionsOpen ? "Cerrar secciones" : "Abrir secciones"}
                  </button>
                  */}
                    <button onClick={handleCheckMail} className="toggle-button">
                      Check Correo
                    </button>
                    <button
                      onClick={() => handleOpenFolder(item.folderDocument)}
                      className="toggle-button"
                    >
                      Documentos
                    </button>
                    <button
                      onClick={() => handleFactura(item)}
                      className="toggle-button"
                    >
                      Factura
                    </button>
                    <button
                      onClick={() => handlePrint(index)}
                      className="toggle-button"
                    >
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Generic
