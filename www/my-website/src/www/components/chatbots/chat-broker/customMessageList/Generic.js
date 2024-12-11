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

  const toggleHideEmptyFields = () => {
    setHideEmptyFields((prev) => !prev)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCheckMail = () => {
    alert("Checking Mail...")
  }

  const handleOpenFolder = (link) => {
    if (link) {
      window.open(link, "_blank") // Apre il link in una nuova finestra/scheda
    } else {
      alert("No folder link available.")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-" // Gestisce i valori vuoti o nulli
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("es-ES", {
        weekday: "long", // Nome completo del giorno
        day: "2-digit", // Giorno con due cifre
        month: "long", // Nome completo del mese
        year: "numeric", // Anno con quattro cifre
      }).format(date)
    } catch (error) {
      console.error("Invalid date:", dateString)
      return dateString // Restituisce la stringa originale in caso di errore
    }
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
                    .filter((key) => key !== "folderDocument") // Escludi il campo `folderDocument`
                    .map((key) => ({
                      key,
                      value: dateFields.includes(key)
                        ? formatDate(item[key]) // Applica la formattazione per le date
                        : getValueOrPlaceholder(item[key]),
                    }))
                    .filter(({ value }) => !hideEmptyFields || value !== "-")

                  if (categoryData.length === 0 && hideEmptyFields) {
                    return null
                  }

                  return (
                    <React.Fragment key={category}>
                      <tr className="category-header">
                        <td colSpan={2} className="title-session">
                          <b>{category}</b>
                        </td>
                      </tr>
                      {categoryData.map(({ key, value }, i) => (
                        <tr key={i}>
                          <td>{translateKey(key)}</td>
                          <td>
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
                      ? "Mostra todo campos"
                      : "Nasconder campos vacio"}
                  </button>
                  <button onClick={handleCheckMail} className="toggle-button">
                    Controlar Correo
                  </button>
                  <button
                    onClick={() => handleOpenFolder(item.folderDocument)}
                    className="toggle-button"
                  >
                    Abrir carpeta Documents
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
