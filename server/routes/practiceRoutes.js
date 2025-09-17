const express = require('express')
const router = express.Router()
const practiceController = require('../controllers/practiceController')

router.get('/', practiceController.getAllPractices)
router.post('/', practiceController.createPractice)
router.put('/bulk', practiceController.updatePractices)
router.put('/:id', practiceController.updatePractice)

module.exports = router;