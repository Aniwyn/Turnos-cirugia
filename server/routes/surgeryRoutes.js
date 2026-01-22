const express = require("express")
const router = express.Router()
const surgeryController = require("../controllers/surgeryController")

router.get("/", surgeryController.getAllSurgery)
router.get("/:id", surgeryController.getSurgeryById)

module.exports = router