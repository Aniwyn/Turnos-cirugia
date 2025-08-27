const express = require('express')
const router = express.Router()
const cashBoxController = require('../controllers/CashBoxController')

router.get('/', cashBoxController.getAllCashBox)
router.get('/my', cashBoxController.getUserCashBoxes)
router.get('/my/open', cashBoxController.getMyOpenCashBox)
router.get('/:id', cashBoxController.getCashBoxById)
router.post('/', cashBoxController.createCashBox)
router.put('/:id', cashBoxController.updateCashBox)
router.put('/:id/close', cashBoxController.closeCashBox)
router.delete('/:id', cashBoxController.deleteCashBox)

module.exports = router