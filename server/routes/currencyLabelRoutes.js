const express = require("express");
const router = express.Router();
const currencyLabelController = require("../controllers/currencyLabelController");

router.get("/", currencyLabelController.getAllLabels);
router.get("/:id", currencyLabelController.geLabelById);

module.exports = router;