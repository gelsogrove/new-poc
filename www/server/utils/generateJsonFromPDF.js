const fs = require("fs")
const pdfParse = require("pdf-parse")

// Funzione per analizzare i dati e costruire il JSON
function parseCustomerData(text, pageNumber) {
  const lines = text.split("\n")
  const customers = []
  let customer = null

  // Mappa dei mesi
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  let pageNum = 0
  for (const line of lines) {
    // Riconosciamo l'inizio di un cliente
    const customerMatch = line.match(
      /^(\w+)\s+(.+?)\s+(KEYM4|RETAIL|WHOLESALE)\s+(.+)/
    )
    if (customerMatch) {
      if (customer) customers.push(customer) // Salva il cliente precedente
      pageNum++

      customer = {
        customer_id: customerMatch[1],
        name: customerMatch[2].trim(),
        class: customerMatch[3],
        salesperson: customerMatch[4].trim(),
        items: [],
        total_quantity: 0,
        total_price: 0,
        order_date: null, // Campo per l'intervallo di date d'ordine
        user_id: null, // Campo per l'ID utente
        page: pageNumber,
      }
    }

    // Riconosciamo l'intervallo delle date d'ordine nel formato tabulare
    const orderDateMatch = line.match(
      /Order Date\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}\/\d{1,2}\/\d{4})/
    )
    if (orderDateMatch) {
      const [_, startDate, endDate] = orderDateMatch
      const [startMonth, startDay, startYear] = startDate.split("/")
      const [endMonth, endDay, endYear] = endDate.split("/")
      if (customer) {
        customer.order_date = {
          raw: `${startDate} - ${endDate}`,
          formatted: {
            start: `${
              months[parseInt(startMonth, 10) - 1]
            } ${startDay}, ${startYear}`,
            end: `${months[parseInt(endMonth, 10) - 1]} ${endDay}, ${endYear}`,
          },
        }
      }
    }

    // Riconosciamo l'ID utente (User ID)
    const userIdMatch = line.match(/User ID:\s+(\w+)/)

    if (userIdMatch && customer) {
      customer.user_id = userIdMatch[1]
    }

    // Riconosciamo gli articoli
    const itemMatch = line.match(
      /^\s*(\w+)\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/
    )
    if (itemMatch && customer) {
      const [_, item_number, description, quantity, price] = itemMatch
      customer.items.push({
        item_number,
        description: description.trim(),
        quantity: parseFloat(quantity.replace(/,/g, "")),
        price: parseFloat(price.replace(/,/g, "")),
        page: pageNumber,
      })
    }

    // Riconosciamo i totali cliente
    const totalsMatch = line.match(
      /Customer Totals:\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})/
    )

    if (totalsMatch && customer) {
      customer.total_quantity = parseFloat(totalsMatch[1].replace(/,/g, ""))
      customer.total_price = parseFloat(totalsMatch[2].replace(/,/g, ""))
    }
  }

  if (customer) customers.push(customer) // Salva l'ultimo cliente
  return customers
}

// Funzione per estrarre i dati dal PDF
async function extractDataFromPdf(pdfPath) {
  const fileBuffer = fs.readFileSync(pdfPath)
  const pdfData = await pdfParse(fileBuffer)
  const customers = []

  let pageNumber = 1
  const pages = pdfData.text.split("\f")

  for (const page of pages) {
    console.log(`Elaborazione pagina ${pageNumber}`)
    const pageCustomers = parseCustomerData(page, pageNumber)
    customers.push(...pageCustomers)
    pageNumber++
  }

  return customers
}

// Percorsi dei file
const inputPdfPath = "pdf/demoPulin.pdf"
const outputJsonPath = "output/output.json"

// Esegui il processo
extractDataFromPdf(inputPdfPath)
  .then((customers) => {
    if (customers.length === 0) {
      console.log("Nessun cliente trovato.")
    } else {
      fs.writeFileSync(
        outputJsonPath,
        JSON.stringify({ customers }, null, 4),
        "utf8"
      )
      console.log(`File JSON generato con successo: ${outputJsonPath}`)
    }
  })
  .catch((err) => {
    console.error("Errore durante l'estrazione dal PDF:", err)
  })
