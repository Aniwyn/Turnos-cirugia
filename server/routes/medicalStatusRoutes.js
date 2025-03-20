const express = require("express");
const router = express.Router();
const medicalStatusController = require("../controllers/medicalStatusController");

router.get("/", medicalStatusController.getAllMedicalStatuses);
router.get("/:id", medicalStatusController.getMedicalStatusById);
router.post("/", medicalStatusController.createMedicalStatus);
router.put("/:id", medicalStatusController.updateMedicalStatus);
router.delete("/:id", medicalStatusController.deleteMedicalStatus);

module.exports = router;