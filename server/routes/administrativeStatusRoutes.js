const express = require("express");
const router = express.Router();
const adminStatusController = require("../controllers/administrativeStatusController");

router.get("/", adminStatusController.getAllAdminStatuses);
router.get("/:id", adminStatusController.getAdminStatusById);
router.post("/", adminStatusController.createAdminStatus);
router.put("/:id", adminStatusController.updateAdminStatus);
router.delete("/:id", adminStatusController.deleteAdminStatus);

module.exports = router;