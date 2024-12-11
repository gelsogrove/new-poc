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

  const handlePrint = () => {
    window.print()
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

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <span>{msg.response}</span>
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

  return (
    <div>
      {response && <p>{response}</p>}
      {data.map((item, index) => {
        const completion = calculateCompletion(item)

        return (
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
                      ? "Mostrar todos los campos "
                      : "Ocultar campos vacíos"}
                  </button>
                  <button onClick={toggleAllSections} className="toggle-button">
                    {allSectionsOpen ? "Cerrar secciones" : "Abrir secciones"}
                  </button>
                  <button onClick={handleCheckMail} className="toggle-button">
                    Correo
                  </button>
                  <button
                    onClick={() => handleOpenFolder(item.folderDocument)}
                    className="toggle-button"
                  >
                    Documents
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Generic
