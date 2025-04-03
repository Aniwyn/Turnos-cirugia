const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyToken } = require("../middlewares/authMiddleware")

router.post("/login", userController.login)
router.get("/auth", verifyToken, userController.getAuthenticatedUser)

module.exports = router