import { PDFDocument } from 'pdf-lib'

const precessPdfIsj = async (pdf_Data) => {    
    try {
        const { ok, meta, anchors, text, pdf } = pdf_Data

        const binary = Uint8Array.from(atob(pdf), c => c.charCodeAt(0))
        const file = new File([binary], 'receta.pdf', { type: 'application/pdf' })
        const arrayBuffer = await file.arrayBuffer()

        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const page = pdfDoc.getPages()[0]
        const { width, height } = page.getSize()

        const newHeight = 430
        const yOffset = height - newHeight
        page.setMediaBox(0, yOffset, width, newHeight)

        const modifiedPdf = await pdfDoc.save()

        // Solo para pruebas
        //const modifiedBlob = new Blob([modifiedPdf], { type: 'application/pdf' })
        //const modifiedUrl = URL.createObjectURL(modifiedBlob)
        //window.open(modifiedUrl, '_blank')
        //console.log("PDF: ", text)

        return { ok, anchors, modifiedPdf, text, type: "OPERACIÓN COMPLETADA CORRECTAMENTE", message: "El PDF se cargo correctamente.", color: "success" }
    } catch (err) {
        console.error('Error to fetch PDF:', err)
        return { ok: false, type: "ERROR", message: err.message, color: "danger" }
    }
}

export default precessPdfIsj