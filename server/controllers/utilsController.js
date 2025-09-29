//const db = require('../models')
const pdfParse = require('pdf-parse')
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs')
const fsp = require('fs').promises // para logs

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toUpperCase();

async function extractSinglePageItems(buffer) {
    const uint8Array = new Uint8Array(buffer)   
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array })
    const pdf = await loadingTask.promise

    

    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()

    const items = content.items.map(it => {
        const [a, b, c, d, e, f] = it.transform // e->x, f->y MAPA !!user units!!
        return {
            str: it.str,
            x: e,
            y: f,
            ax: a,   // estimardor ancho - borrar si no lo uso
            dy: d    // estimardor alto - borrar si no lo uso
        }
    })

    return {
        width: viewport.width,
        height: viewport.height,
        items
    }
}

function findAnchorsSinglePage(page, phrases) {
    const results = []

    for (const item of page.items) {
        const ncItem = norm(item.str)

        for (const ph of phrases) {
            const target = norm(ph.text)
            if (!ncItem.includes(target)) continue
            if (ph.exclude && ph.exclude.test(ncItem)) continue

            const approxCharW = Math.abs(item.ax || 6) * 0.6
            const tail = (item.str || '').length * approxCharW
            const w = Math.max(12, tail + 2)
            const h = Math.max(10, Math.abs(item.dy || 12))

            results.push({
                key: ph.key,
                phrase: ph.text,
                page: 1,
                bboxUser: { x: item.x, y: item.y, w, h },
                matchedSample: item.str
            })
        }
    }

    return results
}


//SOLO PARA GUARDAR TXT, BORRAR ABAJO TAMBIEN
const fs = require("fs")
const path = require("path")


exports.getPDFIsj = async (req, res) => {
    const url = req.query.url
    if (!url) return res.status(400).send('Falta la URL')

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/pdf' },
            redirect: 'follow',
        })
        if (!response.ok) return res.status(502).send(`No se pudo descargar el PDF (status ${response.status})`)

        const arrayBuf = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuf)
        const parsed = await pdfParse(buffer)
        const page = await extractSinglePageItems(buffer)

        const phrases = [
            { key: 'firma', text: 'Firma Profesional, Aclaración y Matrícula' },
            { key: 'fecha', text: 'Fecha', exclude: /FECHA\s+EMISI[ÓO]N/ },
            { key: 'diagnostico', text: 'Diagnóstico CIE-10' }
        ]
        const anchors = findAnchorsSinglePage(page, phrases)

        // GUARDAR TXT DE LAS URL, BORRAR EN EL FUTURO, BORRAR IMPORT TAMBIEN
        const logFile = path.join(__dirname, "../logs/captured_pdfs2.txt")
        fs.mkdirSync(path.dirname(logFile), { recursive: true })
        const time = new Date().toISOString()
        const line = `[${time}] ${url}\n`
        fs.appendFileSync(logFile, line)

        res.json({
            ok: true,
            meta: {
                pageCount: 1,
                pageSizeUserUnits: { width: page.width, height: page.height }
            },
            anchors,
            text: parsed.text,
            pdf: buffer.toString('base64')
        })
    } catch (err) {
        console.error('Error /api/pdf:', err)
        res.status(500).send('Error interno al procesar PDF')
    }
}

exports.logsIsj = async (req, res) => {
    try {
        const { url, time } = req.body || {};
        if (!url) return res.status(400).send('Falta url');

        const logDir = 'logs';
        const logFile = path.join(logDir, 'captured_pdfs.jsonl');
        await fsp.mkdir(logDir, { recursive: true });
        await fsp.appendFile(logFile, JSON.stringify({ url, time: time || new Date().toISOString() }) + '\n', 'utf8');

        res.send('OK');
    } catch (e) {
        console.error('Error guardando log:', e);
        res.status(500).send('Error al guardar log');
    }
}
