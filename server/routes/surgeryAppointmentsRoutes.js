const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/surgeryAppointmentController')

router.get('/paginated', appointmentController.getPaginatedAppointments)
router.get('/filter', appointmentController.getFilteredAppointments)

module.exports = router