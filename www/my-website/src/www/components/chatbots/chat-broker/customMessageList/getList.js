import React from "react"

// Colonne da escludere
const excludedColumns = ["clientId", "SIM"]

// Campi monetari
const moneyFields = [
  "annualIncome",
  "monthlyIncome",
  "availableFunds",
  "agencyOffertMade",
  "loanMoneyRequest",
]

// Funzione per formattare in euro
const formatToEuro = (value) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }
  return value
}

// Funzione per tradurre le chiavi
const translateKey = (key) => {
  const translations = {
    annualIncome: "Ingreso Anual",
    monthlyIncome: "Ingreso Mensual",
    availableFunds: "Fondos Disponibles",
    agencyOffertMade: "Oferta de Agencia",
    loanMoneyRequest: "Solicitud de Préstamo",
    folderDocument: "Documento",
    // Aggiungi altre traduzioni qui
  }
  return translations[key] || key
}

// Funzione principale
export const getList = (msg, showEmptyFields = true) => {
  const { response, data } = msg

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <span>No data available</span>
  }

  // Estrai le intestazioni dalla prima riga dei dati
  const headers = Array.from(
    new Set(data.flatMap((item) => Object.keys(item)))
  ).filter((header) => !excludedColumns.includes(header))

  return (
    <div>
      {response && <p>{response}</p>}
      <div className="table-container">
        <table className="table-custom">
          <thead>
            <tr className="tableheader">
              {headers.map((header) => (
                <th key={header} style={{ padding: "8px", textAlign: "left" }}>
                  {translateKey(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              data
                .map((row, index) => {
                  // Filtra solo i campi con valori definiti se `showEmptyFields` è false
                  const filteredRow = headers.filter(
                    (header) =>
                      showEmptyFields ||
                      (row[header] !== undefined && row[header] !== null)
                  )

                  // Salta completamente le righe vuote
                  if (filteredRow.length === 0) return null

                  return (
                    <tr key={index}>
                      {filteredRow.map((header) => (
                        <td
                          key={header}
                          style={{ padding: "6px", fontSize: "10px" }}
                        >
                          {header === "folderDocument" ? (
                            <a
                              href={row[header]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open
                            </a>
                          ) : moneyFields.includes(header) ? (
                            formatToEuro(row[header]) // Formatta i campi monetari
                          ) : row[header] !== undefined &&
                            row[header] !== null ? (
                            row[header]
                          ) : (
                            "-"
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                })
                .filter(Boolean) /* Filtra i `null` generati da righe vuote */
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
