const express = require("express")
const router = express.Router()

const consulPacientesRoutes = require("./consulPacientesRoutes")

router.use('/consul_pacientes', consulPacientesRoutes)

module.exports = router