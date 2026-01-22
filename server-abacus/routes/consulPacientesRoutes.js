const express = require('express')
const router = express.Router()
const consulPacientesController = require('../controllers/consulPacientesController')

router.get('/', consulPacientesController.getOnePatient)
router.get('/id/:id', consulPacientesController.getOnePatientById)
router.get('/dni/:dni', consulPacientesController.getOnePatientByDni)

module.exports = router
