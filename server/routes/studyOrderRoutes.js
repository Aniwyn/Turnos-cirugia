const express = require("express")
const router = express.Router()
const studyOrderController = require("../controllers/studyOrderController")

router.get("/last", studyOrderController.getLastStudyOrders)
router.get("/pending-overdue", studyOrderController.getPendingOverdueStudyOrders)
router.get("/filter", studyOrderController.getFilteredStudyOrders)
router.get("/:id", studyOrderController.getStudyOrderById)
router.post("/", studyOrderController.createStudyOrder)
router.put("/:id/take", studyOrderController.takeStudyOrder)
router.put("/:id/cancel", studyOrderController.cancelStudyOrder)

module.exports = router