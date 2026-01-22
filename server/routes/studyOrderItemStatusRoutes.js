const express = require("express")
const router = express.Router()
const studyOrderItemStatusController = require("../controllers/studyOrderItemStatusController")

router.get("/", studyOrderItemStatusController.getAllStudyOrderItemStatuses)

module.exports = router