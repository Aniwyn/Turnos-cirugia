const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointmentController')

router.get('/', appointmentController.getAllAppointments)
router.get('/success', appointmentController.getAllSuccessAppointments)
router.get('/:id', appointmentController.getAppointmentById)
router.post('/', appointmentController.createAppointment)
router.put('/:id', appointmentController.updateAppointment)
router.put('/success/:id', appointmentController.successAppointment)
router.delete('/:id', appointmentController.deleteAppointment)

module.exports = router