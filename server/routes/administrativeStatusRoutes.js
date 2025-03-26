const express = require("express");
const router = express.Router();
const adminStatusController = require("../controllers/administrativeStatusController");

router.get("/", adminStatusController.getAllAdminStatuses)
router.get("/:id", adminStatusController.getAdminStatusById)

module.exports = router;