const express = require("express")
const router = express.Router()
const studyOrderItemController = require("../controllers/studyOrderItemController")

router.put("/:id/complete", studyOrderItemController.completeStudyOrderItem)
router.put("/:id/reject", studyOrderItemController.rejectStudyOrderItem)
router.put("/:id/edit", studyOrderItemController.editStudyOrderItem)
router.put("/order/:orderId/complete-all", studyOrderItemController.completeAllStudyOrderItems)
router.put("/order/:orderId/reject-all", studyOrderItemController.rejectAllStudyOrderItems)

module.exports = router