import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const drawCenteredText = (page, text, y, containerX, size, font, color = rgb(0, 0, 0)) => {
    if (!text) return

    const textWidth = font.widthOfTextAtSize(text, size)
    const x = containerX - textWidth / 2

    /*page.drawRectangle({
        x: x,
        y: y - size * 0.25, // ajustamos para que cubra detrás del texto
        width: textWidth,
        height: size * 1.2, // un poco más alto que el texto
        color: rgb(1, 0, 0), // rojo
        opacity: 0.3 // opcional, para ver el texto encima
    })*/

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
                    anchor.bboxUser.y + anchor.bboxUser.h + 21,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    10,
                    font
                )
                drawCenteredText(
                    page,
                    medic.prof,
                    anchor.bboxUser.y + anchor.bboxUser.h + 14,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    8,
                    font
                )
                drawCenteredText(
                    page,
                    medic.esp,
                    anchor.bboxUser.y + anchor.bboxUser.h + 7,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    8,
                    font
                )
                drawCenteredText(
                    page,
                    medic.mp,
                    anchor.bboxUser.y + anchor.bboxUser.h,
                    anchor.bboxUser.x + ((anchor.bboxUser.w * 0.75) / 2),
                    8,
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