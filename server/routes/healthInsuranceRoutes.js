const express = require('express');
const router = express.Router();
const healthInsuranceController = require('../controllers/healthInsuranceController');

router.get('/', healthInsuranceController.getAllHealthInsurances)

module.exports = router;