const express = require("express")
const router = express.Router()

const appointmentRoutes = require("./appointmentRoutes");
const patientRoutes = require('./patientRoutes')
const adminStatusRoutes = require("./administrativeStatusRoutes")
const medicalStatusRoutes = require("./medicalStatusRoutes")
const surgeryRoutes = require("./surgeryRoutes")
const medicRoutes = require("./medicRoutes")
const currencyLabelRoutes = require("./currencyLabelRoutes")
const userRoutes = require("./userRoutes")
const { verifyToken } = require("../middlewares/authMiddleware")

router.use('/appointments', verifyToken, appointmentRoutes)
router.use('/patients', verifyToken, patientRoutes)
router.use("/administrative-status", verifyToken, adminStatusRoutes)
router.use("/medical-status", verifyToken, medicalStatusRoutes)
router.use("/surgeries", verifyToken, surgeryRoutes)
router.use("/medics", verifyToken, medicRoutes)
router.use("/currency-label", currencyLabelRoutes)
router.use("/users", userRoutes)

module.exports = router