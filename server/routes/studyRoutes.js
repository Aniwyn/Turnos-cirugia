const express = require("express")
const router = express.Router()
const studyController = require("../controllers/studyController")

router.get("/", studyController.getAllStudies)

module.exports = router