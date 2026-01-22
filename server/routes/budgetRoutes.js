const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgetController')

router.get('/', budgetController.getAllBudget)
router.get('/paginated', budgetController.getPaginatedBudgets)
router.get('/filter', budgetController.getFilteredBudgets)
router.get('/:id', budgetController.getBudgetByID)
router.post('/', budgetController.createBudget)

module.exports = router