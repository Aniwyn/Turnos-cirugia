const db = require('../models')
const fs = require("fs").promises
const path = require("path")
const pdfParse = require("pdf-parse")
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib")
const STAMPS = require("../stamps/stamp")

exports.getPDFFolder = async (req, res) => {
    try {
        const { folderPath } = req.body
        console.log(folderPath)

        if (!folderPath) {
            folderPath = "C:\\Certificados_implantes"
            //return res.status(400).json({ error: "Folder path is required" })
        }

        try {
            await fs.access(folderPath)
        } catch (error) {
            console.log(error)
            return res.status(404).json({ error: "Folder not found" })
        }

        const files = await fs.readdir(folderPath)
        const pdfFiles = files.filter(file =>
            path.extname(file).toLowerCase() === ".pdf" &&
            !path.basename(file).startsWith("SALIDA_") &&
            !path.basename(file).startsWith("FIRMADO_")
        )

        const processedFiles = []
        for (const filename of pdfFiles) {
            try {
                const filePath = path.join(folderPath, filename)
                const dataBuffer = await fs.readFile(filePath)
                const pdfData = await pdfParse(dataBuffer)

                console.log(filename)
                processedFiles.push({
                    filename,
                    content: pdfData.text
                })
            } catch (error) {
                console.error(`Error processing ${filename}:`, error)
                processedFiles.push({
                    filename,
                    content: "",
                    error: `Error reading file: ${error.message}`,
                })
            }
        }

        res.json({
            success: true,
            folderPath,
            totalFiles: pdfFiles.length,
            files: processedFiles,
        })
    } catch (error) {
        console.error("Error reading folder:", error)
        res.status(500).json({
            error: "Internal server error",
            message: error.message,
        })
    }
}

exports.processPDF = async (req, res) => {
    try {
        const { folderPath, files } = req.body

        console.log(folderPath, "\n\n")

        if (!folderPath || !files || files.length === 0) {
            return res.status(400).json({ error: "Missing data" })
        }

        const finalPdf = await PDFDocument.create()
        const font = await finalPdf.embedFont(StandardFonts.Helvetica)

        for (const file of files) {
            console.log(file)
            const { filename, surgeryDate, surgeryTime, surgeonID } = file

            const filePath = path.join(folderPath, filename)
            const existingPdfBytes = await fs.readFile(filePath)

            const pdfDoc = await PDFDocument.load(existingPdfBytes)

            const stamp = STAMPS.find(s => s.ID === surgeonID)
            let signatureImg
            if (stamp) {
                const sigPath = path.join(__dirname, "..", "stamps", stamp.signature)
                const sigBytes = await fs.readFile(sigPath)
                signatureImg = await pdfDoc.embedPng(sigBytes)
            }

            // Primera página
            const pages = pdfDoc.getPages()
            const firstPage = pages[0]

            // --- Fecha ---
            firstPage.drawText(String(surgeryDate.day), {
                x: 121, y: 601, size: 12, font, color: rgb(0, 0, 0)
            })
            firstPage.drawText(String(surgeryDate.month).padStart(2, "0"), {
                x: 145, y: 601, size: 12, font, color: rgb(0, 0, 0)
            })
            firstPage.drawText(String(surgeryDate.year).slice(-2), {
                x: 170, y: 601, size: 12, font, color: rgb(0, 0, 0)
            })

            // --- Hora ---
            firstPage.drawText(String(surgeryTime.hour).padStart(2, "0"), {
                x: 195, y: 601, size: 12, font, color: rgb(0, 0, 0)
            })
            firstPage.drawText(String(surgeryTime.minute).padStart(2, "0"), {
                x: 220, y: 601, size: 12, font, color: rgb(0, 0, 0)
            })

            // --- Suministros usados ---
            firstPage.drawText("X", {
                x: 544, y: 519, size: 12, font, color: rgb(0, 0, 0)
            })

            // --- Datos del cirujano ---
            if (stamp) {
                let baseY = 62
                const fontSize = 12
                const centerX = 160 // el "centro" donde querés que se alinee el texto

                const drawCenteredText = (page, text, y) => {
                    const textWidth = font.widthOfTextAtSize(text, fontSize)
                    const drawX = centerX - textWidth / 2
                    page.drawText(text, { x: drawX, y, size: fontSize, font })
                }

                pdfDoc.getPages().forEach(page => {
                    drawCenteredText(page, stamp.name, baseY)
                    drawCenteredText(page, stamp.prof, baseY - 10)
                    drawCenteredText(page, stamp.esp, baseY - 20)
                    drawCenteredText(page, stamp.mp, baseY - 30)

                    if (signatureImg) {
                        page.drawImage(signatureImg, {
                            x: centerX - 50, // mitad del ancho de la imagen
                            y: baseY - 20,
                            width: 100,
                            height: 100
                        })
                    }
                })
            }

            // Copiar páginas al PDF final
            const copiedPages = await finalPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
            copiedPages.forEach(p => finalPdf.addPage(p))
        }

        // Guardar PDF final
        const pdfBytes = await finalPdf.save()
        const timestamp = Date.now() // milisegundos actuales
        const outputPath = path.join(folderPath, `SALIDA_${timestamp}.pdf`)
        await fs.writeFile(outputPath, pdfBytes)

        // Renombrar PDFs originales
        //for (const file of files) {
        //    const oldPath = path.join(folderPath, file.filename)
        //    const newPath = path.join(folderPath, `FIRMADO_${file.filename}`)
        //    try {
        //        await fs.access(oldPath) // verifica si existe
        //        await fs.rename(oldPath, newPath)
        //    } catch (err) {
        //        console.warn(`No se pudo renombrar ${file.filename}: ${err.message}`)
        //    }
        //}

        res.json({ success: true, output: outputPath })
    } catch (error) {
        console.error("Error en processPDF:", error)
        res.status(500).json({ error: "Error procesando PDFs", message: error.message })
    }
}

exports.saveURL = async (req, res) => {
    try {
        const { url, time } = req.body
        const logFile = path.join(__dirname, "../logs/captured_pdfs.txt")

        fs.mkdirSync(path.dirname(logFile), { recursive: true })

        const line = `[${time}] ${url}\n`

        fs.appendFileSync(logFile, line)

        console.log("Guardado en log:", line.trim())
        res.send("OK")
    } catch (error) {
        console.error("Error guardando log:", error)
        res.status(500).send("Error al guardar log")
    }
}
