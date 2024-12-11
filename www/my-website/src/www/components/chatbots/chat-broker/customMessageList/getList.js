import React from "react"
import { translateKey } from "./helpers"
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

// Funzione principale
export const getList = (msg) => {
  const { response, data } = msg

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <span>No hay datos</span>
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
            <tr>
              {headers.map((header) => (
                <th key={header}>{translateKey(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {headers.map((header) => (
                  <td key={header}>
                    {header === "folderDocument" ? (
                      <a
                        href={row[header]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                    ) : moneyFields.includes(header) ? (
                      formatToEuro(row[header])
                    ) : (
                      row[header] || "-"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
