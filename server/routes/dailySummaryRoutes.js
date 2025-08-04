const express = require('express');
const router = express.Router();
const dailySummaryController = require('../controllers/DailySummaryController');

router.get('/', dailySummaryController.getAllDailySummary);
router.get('/:id', dailySummaryController.getDailySummaryById);
router.post('/', dailySummaryController.createDailySummary);
router.put('/:id', dailySummaryController.updateDailySummary);
router.delete('/:id', dailySummaryController.deleteDailySummary);

module.exports = router;