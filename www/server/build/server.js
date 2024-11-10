const { exec } = require("child_process")
const { Console } = require("console")
const fs = require("fs")
const path = require("path")

const buildDir = "/Users/gelso/workspace/PoC/www/my-website/build"
const targetDir = "/Users/gelso/workspace/PoC/www/my-website/heroku/public"

function runCommand(command, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Errore nell'esecuzione di ${command}:`, error)
        reject(error)
      } else {
        console.log(`Comando ${command} eseguito con successo:\n${stdout}`)
        resolve()
      }
    })
  })
}

async function main() {
  try {
    // 1. Naviga nella directory e esegui "npm run build"
    console.log("Eseguendo 'npm run build'...")
    await runCommand(
      "npm run build",
      "/Users/gelso/workspace/PoC/www/my-website/"
    )

    // 2. Sposta i file da buildDir a targetDir
    console.log("Spostando i file di build nella cartella di Heroku...")

    // Crea la cartella di destinazione se non esiste
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    // Copia i file dalla build alla destinazione
    fs.rmSync(targetDir, { recursive: true, force: true }) // Cancella i file esistenti nella destinazione
    fs.cpSync(buildDir, targetDir, { recursive: true }) // Copia i file

    console.log("File copiati con successo!")

    // 3. Esegui "git add ."
    console.log("Eseguendo 'git add .'...")
    await runCommand(
      "git add .",
      "/Users/gelso/workspace/PoC/www/my-website/heroku/"
    )

    // 4. Esegui "git commit -m 'pushing'"
    console.log("Eseguendo 'git commit'...")
    await runCommand(
      'git commit -m "pushing"',
      "/Users/gelso/workspace/PoC/www/my-website/heroku/"
    )

    // 5. Esegui "git push heroku main"
    console.log("Eseguendo 'git push heroku main'...")
    await runCommand(
      "git push heroku main",
      "/Users/gelso/workspace/PoC/www/my-website/heroku/"
    )

    // 6. Cancella la cartella di build
    console.log("Cancellando la cartella di build...")
    fs.rmSync(buildDir, { recursive: true, force: true })
    console.log("Cartella di build cancellata con successo!")

    console.log("Script completato con successo!")
  } catch (error) {
    // console.error("Errore nello script:", error)
    console.log("No change on the project")
  }
}

main()
