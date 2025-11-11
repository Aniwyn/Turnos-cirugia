const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController')

router.get('/', patientController.getAllPatients)
router.get('/paginated', patientController.getPaginatedPatients)
router.get('/filter', patientController.getFilteredPatients)
router.get('/:id', patientController.getPatientById)
router.get('/dni/:dni', patientController.getPatientByDni)
router.post('/', patientController.createPatient)
router.put('/:id', patientController.updatePatient)

module.exports = router