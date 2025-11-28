const express = require('express')
const router = express.Router()
const stampController = require('../controllers/stampController')

router.get('/user/:id', stampController.getStampByUserId)
router.get('/my', stampController.getMyStamp)
router.get('/image/:img_name', stampController.getStampImageByName)

module.exports = router