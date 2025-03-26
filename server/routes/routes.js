const express = require("express")

const router = express.Router()
const patientRoutes = require('./patientRoutes')
const appointmentRoutes = require("./appointmentRoutes");
/*const userRoutes = require("./userRoutes");*/
const adminStatusRoutes = require("./administrativeStatusRoutes")
const medicalStatusRoutes = require("./medicalStatusRoutes")

router.use('/patients', patientRoutes)
router.use('/appointments', appointmentRoutes);
/*router.use("/users", userRoutes);*/
router.use("/administrative-status", adminStatusRoutes)
router.use("/medical-status", medicalStatusRoutes)

module.exports = router