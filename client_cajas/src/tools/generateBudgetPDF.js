import { PDFDocument, rgb } from 'pdf-lib'
import budgetTemplate from "../assets/budget.pdf"
import stampImage from "./stamp.png"

const generateBudgetPDF = async (budgetData) => {
    const existingPdfBytes = await fetch(budgetTemplate).then(res => res.arrayBuffer())
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    const pngBytes = await fetch(stampImage).then(res => res.arrayBuffer())
    const pngImage = await pdfDoc.embedPng(pngBytes)

    const pages = pdfDoc.getPages()
    const page = pages[0]

    console.log("pdfgenerartor", budgetData)

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

    page.drawText(`$ ${budgetData.total.replace(".", ",")}`, { x: 740, y: 142, size: 9, color: rgb(0, 0, 0) })

    let y = 320
    budgetData.items.forEach((item, index) => {
        page.drawText(item.id.toString(), { x: 45, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(item.practice_name, { x: 80, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(item.module, { x: 387, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(item.code, { x: 428, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(item.quantity.toString(), { x: 494, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(eyeMap[item.eye], { x: 540, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(`$ ${item.price.replace(".", ",")}`, { x: 605, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(`${item.iva.replace(".", ",")}%`, { x: 682, y, size: 9, color: rgb(0, 0, 0) })
        page.drawText(`$ ${item.price.replace(".", ",")}`, { x: 740, y, size: 9, color: rgb(0, 0, 0) })

        y -= 16
    })

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