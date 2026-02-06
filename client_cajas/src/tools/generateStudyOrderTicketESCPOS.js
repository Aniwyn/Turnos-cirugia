import { formatDateFromDB, formatDateTimeFromDB, uint8ToBase64, formatDNI } from './utils'

const ESC = '\x1B'
const GS = '\x1D'

const COMMANDS = {
    INIT: ESC + '@',
    ALIGN_LEFT: ESC + 'a' + '\x00',
    ALIGN_CENTER: ESC + 'a' + '\x01',
    ALIGN_RIGHT: ESC + 'a' + '\x02',
    BOLD_ON: ESC + 'E' + '\x01',
    BOLD_OFF: ESC + 'E' + '\x00',
    TEXT_NORMAL: ESC + '!' + '\x00',
    TEXT_DOUBLE_HEIGHT: ESC + '!' + '\x10',
    TEXT_DOUBLE_WIDTH: ESC + '!' + '\x20',
    TEXT_DOUBLE_SIZE: ESC + '!' + '\x30',
    CUT: GS + 'V' + '\x41' + '\x03',
    LF: '\x0A'
}

const sanitizeText = (text) => {
    if (!text) return ''
    return text.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n")
        .replace(/Ñ/g, "N")
}

const generateTicketBuffer = (studyOrder) => {
    const encoder = new TextEncoder()
    const buffer = []

    const add = (command) => {
        if (typeof command === 'string') {
            buffer.push(encoder.encode(command))
        } else if (command instanceof Uint8Array) {
            buffer.push(command)
        }
    }

    const addText = (text) => {
        add(sanitizeText(text))
    }

    const addLine = (text = '') => {
        addText(text)
        add(COMMANDS.LF)
    }

    add(COMMANDS.INIT)

    // Encabezado
    add(COMMANDS.ALIGN_CENTER)
    add(COMMANDS.BOLD_ON)
    addLine("- - - - - - - - - - - - - - - - - - - - - - - -")
    add(COMMANDS.BOLD_OFF)

    add(COMMANDS.TEXT_DOUBLE_HEIGHT)
    addLine(`Orden: ${studyOrder.id || '---'}`)
    add(COMMANDS.TEXT_NORMAL)

    addLine(formatDateTimeFromDB(new Date()))
    add(COMMANDS.LF)

    // Datos del Paciente
    add(COMMANDS.ALIGN_LEFT)
    add(COMMANDS.BOLD_ON)
    addText("PACIENTE: ")
    add(COMMANDS.BOLD_OFF)
    addLine(`${studyOrder.patient_last_name || ''}, ${studyOrder.patient_first_name || ''}`)

    add(COMMANDS.BOLD_ON)
    addText("DNI: ")
    add(COMMANDS.BOLD_OFF)
    addLine(formatDNI(studyOrder.patient_dni))

    add(COMMANDS.BOLD_ON)
    addText("O.S.: ")
    add(COMMANDS.BOLD_OFF)
    addLine(studyOrder.health_insurance_name || '-')

    add(COMMANDS.BOLD_ON)
    addText("F.N.: ")
    add(COMMANDS.BOLD_OFF)
    addLine(formatDateFromDB(studyOrder.birth_date) || '-')

    add(COMMANDS.BOLD_ON)
    addText("EMAIL: ")
    add(COMMANDS.BOLD_OFF)
    addLine(studyOrder.email.toUpperCase() || '-')

    add(COMMANDS.LF)

    // Estudios
    add(COMMANDS.BOLD_ON)
    addLine("ESTUDIOS SOLICITADOS:")
    add(COMMANDS.BOLD_OFF)

    const items = studyOrder.items || studyOrder.studies || []
    items.forEach(item => {
        const text = item.description || item.practice_name || "Estudio"
        const eye = item.eye

        console.log(eye)

        addText("[ ] ")
        add(COMMANDS.BOLD_ON)
        addText(`${eye}`)
        add(COMMANDS.BOLD_OFF)
        addLine(`${text}`)
    })

    // Observaciones
    if (studyOrder.observations) {
        add(COMMANDS.LF)
        add(COMMANDS.BOLD_ON)
        addLine("OBSERVACIONES:")
        add(COMMANDS.BOLD_OFF)
        addLine(studyOrder.observations)
    }

    // Pie
    addLine("- - - - - - - - - - - - - - - - - - - - - - - -")
    add(COMMANDS.ALIGN_CENTER)
    if (studyOrder.doctor_name) {
        addText("Dr/a: ")
        add(COMMANDS.BOLD_ON)
        addLine(studyOrder.doctor_name || '-')
    }

    add(COMMANDS.LF)
    add(COMMANDS.CUT)

    const totalLength = buffer.reduce((acc, val) => acc + val.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of buffer) {
        result.set(chunk, offset)
        offset += chunk.length
    }

    return result
}

export const printTicketAgent = async (studyOrder, options = {}) => {
    const printerName = options.printerName || "EPSON TM-T20III Receipt"
    const agentUrl = options.agentUrl || "http://127.0.0.1:3333/print"

    const result = generateTicketBuffer(studyOrder)
    const dataBase64 = uint8ToBase64(result)

    const response = await fetch(agentUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printerName, dataBase64 })
    })

    const json = await response.json().catch(() => null)

    if (!response.ok) {
        const details = json?.stderr || json?.error || response.statusText
        throw new Error(`Print Agent error: ${details}`)
    }

    if (!json?.ok) {
        throw new Error(`Print Agent error: ${json?.error || 'Unknown error'}`)
    }

    return json
}
