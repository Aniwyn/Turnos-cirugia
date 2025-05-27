const express = require("express");
const router = express.Router();
const medicController = require("../controllers/medicController");

router.get("/", medicController.getAllAMedics);
router.get("/:id", medicController.geMedicById);

module.exports = router;