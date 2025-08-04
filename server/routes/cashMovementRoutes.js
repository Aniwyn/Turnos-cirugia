const express = require('express')
const router = express.Router()
const cashMovementController = require('../controllers/CashMovementController')

router.get('/', cashMovementController.getAllCashMovements)
router.get('/:id', cashMovementController.getCashMovementById)
router.post('/', cashMovementController.createCashMovement)
router.put('/:id', cashMovementController.updateCashMovement)
router.delete('/:id', cashMovementController.deleteCashMovement)

module.exports = router