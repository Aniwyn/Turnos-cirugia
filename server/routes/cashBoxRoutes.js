const express = require('express')
const router = express.Router()
const cashBoxController = require('../controllers/CashBoxController')

router.get('/', cashBoxController.getAllCashBox)
router.get('/paginated', cashBoxController.getPaginatedCashBoxes)
router.get('/my', cashBoxController.getUserCashBoxesPaginated)
router.get('/my/active', cashBoxController.getMyActiveCashBox)
router.get('/available-for-main-box', cashBoxController.getAvailableForMainBox)
router.get('/:id', cashBoxController.getCashBoxById)
router.post('/', cashBoxController.createCashBox)
router.put('/:id', cashBoxController.updateCashBox)
router.put('/:id/link-main-box', cashBoxController.linkMainBox)
router.put('/:id/unlink-main-box', cashBoxController.unlinkMainBox)
router.put('/:id/close', cashBoxController.closeCashBox)
router.delete('/:id', cashBoxController.deleteCashBox)

module.exports = router