const express = require("express");
const router = express.Router();
const medicalStatusController = require("../controllers/medicalStatusController");

router.get("/", medicalStatusController.getAllMedicalStatuses);
router.get("/:id", medicalStatusController.getMedicalStatusById);

module.exports = router;