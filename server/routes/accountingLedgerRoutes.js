const express = require("express")
const router = express.Router()
const accountingLedgerController = require("../controllers/accountingLedgerController")

router.get("/", accountingLedgerController.getAllAccountingLedger)
router.get("/paginated", accountingLedgerController.getPaginatedAccountingLedger)
router.get('/range', accountingLedgerController.getAccountingLedgerByDateRange)
router.get("/last", accountingLedgerController.getLastAccountingLedger)
// router.get("/", accountingLedgerController.getAllAdminStatuses)
// router.get("/", accountingLedgerController.getAllAdminStatuses)
// router.get("/", accountingLedgerController.getAllAdminStatuses)

module.exports = router