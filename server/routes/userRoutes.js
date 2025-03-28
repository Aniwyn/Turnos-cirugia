const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyToken } = require("../middlewares/authMiddleware")

router.post("/login", userController.login)
router.get("/profile", verifyToken, (req, res) => {
    res.json({ message: "Access granted", user: req.user })
})

module.exports = router