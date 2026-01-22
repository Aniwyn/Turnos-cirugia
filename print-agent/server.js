import express from 'express'
import cors from 'cors'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const app = express()

app.use(express.json({ limit: '2mb' }))

const allowedOrigins = [
    'http://192.168.0.100',
    'http://192.168.0.100:80',
    'http://192.168.0.100:3009',
    'http://localhost:5173',
]

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true)
        if (allowedOrigins.includes(origin)) return cb(null, true)
        return cb(new Error('CORS blocked: ' + origin))
    }
}))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const psScriptPath = path.join(__dirname, 'raw-print.ps1')

app.get('/health', (req, res) => {
    res.json({ ok: true })
})

app.get('/printers', async (req, res) => {
    try {
        const out = await runPowerShell(`
      Get-Printer | Select-Object Name, DriverName, PortName | ConvertTo-Json
    `)
        const parsed = safeJsonParse(out)
        res.json({ ok: true, printers: parsed })
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e) })
    }
})

app.post('/print', async (req, res) => {
    try {
        const { dataBase64, printerName } = req.body || {}

        if (!dataBase64) {
            return res.status(400).json({ ok: false, error: 'Missing dataBase64' })
        }
        if (!printerName) {
            return res.status(400).json({ ok: false, error: 'Missing printerName' })
        }

        const args = [
            '-NoProfile',
            '-ExecutionPolicy', 'Bypass',
            '-File', psScriptPath,
            '-PrinterName', printerName,
            '-Base64', dataBase64
        ]

        const ps = spawn('powershell.exe', args, { windowsHide: true })

        let stdout = ''
        let stderr = ''

        ps.stdout.on('data', d => { stdout += d.toString() })
        ps.stderr.on('data', d => { stderr += d.toString() })

        ps.on('close', code => {
            if (code === 0) {
                res.json({ ok: true, result: stdout.trim() })
            } else {
                res.status(500).json({
                    ok: false,
                    error: 'Print failed',
                    code,
                    stdout: stdout.trim(),
                    stderr: stderr.trim()
                })
            }
        })
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e) })
    }
})

const PORT = 3333
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Print Agent running on http://127.0.0.1:${PORT}`)
})

function runPowerShell(command) {
    return new Promise((resolve, reject) => {
        const ps = spawn('powershell.exe', [
            '-NoProfile',
            '-ExecutionPolicy', 'Bypass',
            '-Command', command
        ], { windowsHide: true })

        let out = ''
        let err = ''

        ps.stdout.on('data', d => { out += d.toString() })
        ps.stderr.on('data', d => { err += d.toString() })

        ps.on('close', code => {
            if (code === 0) return resolve(out)
            reject(err || out || ('PowerShell exited with code ' + code))
        })
    })
}

function safeJsonParse(s) {
    try { return JSON.parse(s) } catch { return s }
}
