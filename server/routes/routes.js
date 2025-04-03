const express = require("express")

const router = express.Router()
const patientRoutes = require('./patientRoutes')
const appointmentRoutes = require("./appointmentRoutes");
const userRoutes = require("./userRoutes")
const adminStatusRoutes = require("./administrativeStatusRoutes")
const medicalStatusRoutes = require("./medicalStatusRoutes")
const surgeryRoutes = require("./surgeryRoutes")
const { verifyToken } = require("../middlewares/authMiddleware")

router.use('/patients', verifyToken, patientRoutes)
router.use('/appointments', verifyToken, appointmentRoutes)
router.use("/users", userRoutes)
router.use("/administrative-status", verifyToken, adminStatusRoutes)
router.use("/medical-status", verifyToken, medicalStatusRoutes)
router.use("/surgeries", verifyToken, surgeryRoutes)

module.exports = router