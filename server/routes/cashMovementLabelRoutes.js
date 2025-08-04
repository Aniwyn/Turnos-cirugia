const express = require("express");
const router = express.Router();
const CashMovementLabelController = require("../controllers/CashMovementLabelController");

router.get("/", CashMovementLabelController.getAllLabels);
router.get("/:id", CashMovementLabelController.geLabelById);

module.exports = router;