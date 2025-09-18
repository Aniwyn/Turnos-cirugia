import { PDFDocument, rgb } from 'pdf-lib'
import budgetTemplate from "../assets/budget.pdf"
import stampImage from "./stamp.png"

const generateBudgetPDF = async (budgetData) => {
    const existingPdfBytes = await fetch(budgetTemplate).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const font = await pdfDoc.embedFont('Helvetica')

    const pngBytes = await fetch(stampImage).then(res => res.arrayBuffer())
    const pngImage = await pdfDoc.embedPng(pngBytes)

    const pages = pdfDoc.getPages()
    const page = pages[0]

    console.log("pdfgenerartor", budgetData)

    const drawCenteredText = (page, text, y, containerX, containerWidth, size, font, color = rgb(0, 0, 0)) => {
        if (!text) return

        const textWidth = font.widthOfTextAtSize(text, size)
        const x = containerX + (containerWidth - textWidth) / 2

        page.drawText(text, { x, y, size, font, color })
    }

    const drawRightAlignedText = (page, text, y, containerX, containerWidth, size, font) => {
        if (!text) return

        const textWidth = font.widthOfTextAtSize(text, size)
        const x = containerX + containerWidth - textWidth

        page.drawText(text, { x, y, size, font })
    }

    const formattedDate = new Date(budgetData.budget_date)
        .toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })

    const eyeMap = {
        AO: "Ambos",
        OD: "Derecho",
        OI: "Izquierdo"
    }

    page.drawText(budgetData.id.toString() || '', { x: 735, y: 548, size: 11, color: rgb(0, 0, 0) })
    page.drawText(formattedDate || '', { x: 735, y: 534, size: 11, color: rgb(0, 0, 0) })
    page.drawText(`${budgetData.validity_days} días`, { x: 735, y: 519, size: 11, color: rgb(0, 0, 0) })

    page.drawText(budgetData.recipient || '', { x: 105, y: 435, size: 9, color: rgb(0, 0, 0) })
    page.drawText(budgetData.extra_line || '', { x: 105, y: 420, size: 9, color: rgb(0, 0, 0) })
    page.drawText(budgetData.patient_name || '', { x: 105, y: 405, size: 9, color: rgb(0, 0, 0) })
    page.drawText(budgetData.patient_dni || '', { x: 105, y: 390, size: 9, color: rgb(0, 0, 0) })

    let y = 320
    budgetData.items.forEach(item => {
        page.drawText(item.id.toString(), { x: 45, y, size: 9 })
        page.drawText(item.practice_name, { x: 80, y, size: 9 })
        drawCenteredText(page, item.module, y, 368, 50, 9, font)
        drawCenteredText(page, item.code, y, 418, 50, 9, font)
        drawCenteredText(page, item.quantity.toString(), y, 484, 30, 9, font)
        drawCenteredText(page, eyeMap[item.eye], y, 535, 50, 9, font)
        drawRightAlignedText(page, `$ ${item.price.replace(".", ",")}`, y, 600, 70, 9, font)
        drawCenteredText(page, `${item.iva.replace(".", ",")}%`, y, 682, 30, 9, font)
        drawRightAlignedText(page, `$ ${((item.price * item.quantity * (1 + item.iva / 100)).toFixed(2)).replace(".", ",")}`, y, 730, 70, 9, font)



        y -= 16
    })

    drawRightAlignedText(page, `$ ${budgetData.total.replace(".", ",")}`, 142, 730, 70, 9, font)
    
    //CAMBIAR!!!
    page.drawText("Norma, Raquel Arias", { x: 145, y: 84, size: 11, color: rgb(0, 0, 0) })
    page.drawImage(pngImage, { x: 145, y: 90, width: 80, height: 80 })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `Presupuesto-${budgetData.patient_name}.pdf`
    link.click()
}

export default generateBudgetPDF