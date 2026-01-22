const express = require("express")
const router = express.Router()
const studyOrderStatusController = require("../controllers/studyOrderStatusController")

router.get("/", studyOrderStatusController.getAllStudyOrderStatuses)

module.exports = router