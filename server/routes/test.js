const express = require("express");
const router = express.Router();
const test = require("../controllers/test");

router.post("/", test.getPDFFolder);
router.post("/process", test.processPDF)
//router.post("/logs", test.saveURL)

module.exports = router;