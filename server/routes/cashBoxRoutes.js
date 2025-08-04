const express = require('express')
const router = express.Router()
const cashBoxController = require('../controllers/CashBoxController')

router.get('/', cashBoxController.getAllCashBox)
router.get('/:id', cashBoxController.getCashBoxById)
router.post('/', cashBoxController.createCashBox)
router.put('/:id', cashBoxController.updateCashBox)
router.delete('/:id', cashBoxController.deleteCashBox)

module.exports = router