const express = require('express')
const router = express.Router()
const mainBoxController = require('../controllers/mainBoxController')

router.get('/', mainBoxController.getAllMainBoxes)
router.get('/paginated', mainBoxController.getPaginatedMainBoxes)
router.get('/my/active', mainBoxController.getMyActiveMainBox)
router.get('/:id/cash-boxes', mainBoxController.getCashBoxesForMainBox)
router.get('/:id', mainBoxController.getMainBoxById)
router.post('/:id/close', mainBoxController.closeMainBox)

module.exports = router