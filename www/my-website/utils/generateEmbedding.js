const fs = require("fs")
const path = require("path")
const Tesseract = require("tesseract.js")
const { fromPath } = require("pdf2pic") // Usa pdf2pic per la conversione
const { PDFDocument } = require("pdf-lib") // Usa pdf-lib per ottenere il numero di pagine
const axios = require("axios")
require("dotenv").config()

async function getTotalPages(pdfPath) {
  const data = fs.readFileSync(pdfPath)
  const pdfDoc = await PDFDocument.load(data)
  return pdfDoc.getPageCount()
}

async function convertPDFToImages(pdfPath) {
  const outputDir = path.join(__dirname, "pdf-images")
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  const totalPages = await getTotalPages(pdfPath) // Usa pdf-lib per ottenere il numero di pagine
  const options = {
    density: 100,
    saveFilename: "page",
    savePath: outputDir,
    format: "jpeg",
    width: 1024,
    height: 1448,
  }

  const pdf2pic = fromPath(pdfPath, options)

  for (let page = 1; page <= totalPages; page++) {
    console.log(`Convertendo pagina ${page}/${totalPages} in immagine...`)
    await pdf2pic(page)
    console.log(`Pagina ${page}/${totalPages} convertita in immagine.`)
  }

  return fs.readdirSync(outputDir).map((file) => path.join(outputDir, file))
}

async function extractTextFromImage(imagePath, pageNum, totalPages) {
  console.log(
    `Eseguendo OCR su immagine della pagina ${pageNum}/${totalPages}...`
  )
  const ocrResult = await Tesseract.recognize(imagePath, "eng")
  console.log(`OCR completato per pagina ${pageNum}/${totalPages}.`)
  return ocrResult.data.text
}

async function getEmbedding(text, pageNum, totalPages) {
  try {
    console.log(
      `Generando embedding per il testo della pagina ${pageNum}/${totalPages}...`
    )
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        model: "text-embedding-ada-002",
        input: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )
    console.log(`Embedding generato per la pagina ${pageNum}/${totalPages}.`)
    return response.data.data[0].embedding
  } catch (error) {
    console.error(
      `Errore nel generare l'embedding per pagina ${pageNum}/${totalPages}:`,
      error
    )
    return null
  }
}

async function processPDFToJSON(pdfPath, outputJsonPath) {
  console.log("Convertendo le pagine del PDF in immagini...")
  const imagePaths = await convertPDFToImages(pdfPath)

  const result = []
  const totalPages = imagePaths.length
  for (let i = 0; i < totalPages; i++) {
    const imagePath = imagePaths[i]
    console.log(`\n\n--- Inizio elaborazione pagina ${i + 1}/${totalPages} ---`)

    // Estrai il testo dall'immagine
    const text = await extractTextFromImage(imagePath, i + 1, totalPages)
    console.log(
      `Testo estratto per pagina ${i + 1}/${totalPages}: ${text.slice(
        0,
        100
      )}...`
    )

    // Genera l'embedding del testo estratto
    const embedding = await getEmbedding(text, i + 1, totalPages)
    if (embedding) {
      console.log(
        `Embedding generato con successo per pagina ${i + 1}/${totalPages}.`
      )
    } else {
      console.log(
        `Errore nel generare l'embedding per pagina ${i + 1}/${totalPages}.`
      )
    }

    // Aggiungi al risultato
    result.push({
      page: path.basename(imagePath),
      text: text,
      embedding: embedding,
    })

    console.log(`--- Fine elaborazione pagina ${i + 1}/${totalPages} ---\n\n`)
  }

  // Salva il risultato in un file JSON
  fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 2))
  console.log(`File JSON generato con successo: ${outputJsonPath}`)
}

// Esegui il processo completo
const pdfPath = "./washing-machine-001.pdf"
const outputJsonPath = "./washing-machine-001-data.json"
processPDFToJSON(pdfPath, outputJsonPath)
