import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const drawCenteredText = (page, text, y, containerX, size, font, color = rgb(0, 0, 0)) => {
    if (!text) return

    const textWidth = font.widthOfTextAtSize(text, size)
    const x = containerX - textWidth / 2

    page.drawText(text, { x, y, size, font, color })
}

const generateISJPDF = async (pdfData, anchorsPDF, date, diagnostic, medic) => {
    try {
        const pdfDoc = await PDFDocument.load(pdfData)
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

        const pages = pdfDoc.getPages()
        const page = pages[0]

        anchorsPDF.forEach(anchor => {
            if (anchor.key === 'fecha') {
                drawCenteredText(
                    page,
                    date,
                    anchor.bboxUser.y + anchor.bboxUser.h,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    12,
                    font
                )
            }
            if (anchor.key === 'diagnostico') {
                page.drawText(diagnostic, {
                    x: anchor.bboxUser.x + (anchor.bboxUser.w * 0.75),
                    y: anchor.bboxUser.y,
                    size: 12,
                    font,
                    color: rgb(0, 0, 0),
                })
            }
            if (anchor.key === 'firma') {
                drawCenteredText(
                    page,
                    medic.name,
                    anchor.bboxUser.y + anchor.bboxUser.h + 17,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    8,
                    font
                )
                drawCenteredText(
                    page,
                    medic.prof,
                    anchor.bboxUser.y + anchor.bboxUser.h + 11,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    6.5,
                    font
                )
                drawCenteredText(
                    page,
                    medic.esp,
                    anchor.bboxUser.y + anchor.bboxUser.h + 5.5,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    6.5,
                    font
                )
                drawCenteredText(
                    page,
                    medic.mp,
                    anchor.bboxUser.y + anchor.bboxUser.h,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    6.5,
                    font
                )
            }
        })

        const pdfBytes = await pdfDoc.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)

        window.open(url, '_blank')
    } catch (err) {
        console.error("Error al imprimir PDF:", err)
    }
}


export default generateISJPDF