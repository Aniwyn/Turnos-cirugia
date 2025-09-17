const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgetController')

router.get('/', budgetController.getAllBudget)
router.get('/:id', budgetController.getBudgetByID)
router.post('/', budgetController.createBudget)

module.exports = router