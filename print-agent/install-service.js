import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Service } = require('node-windows')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const svc = new Service({
  name: 'Print Agent',
  description: 'Servicio de impresión local para Turnos Cirugía',
  script: path.join(__dirname, 'server.js'),
})

svc.on('install', () => {
  svc.start()
  console.log('El servicio "Print Agent" ha sido instalado e iniciado correctamente.')
})

svc.install()
