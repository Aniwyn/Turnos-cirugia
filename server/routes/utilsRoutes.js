const express = require("express")
const router = express.Router()
const utilsController = require("../controllers/utilsController")

router.get("/pdf_isj", utilsController.getPDFIsj)
router.post("/logs_isj", utilsController.logsIsj)

module.exports = router;