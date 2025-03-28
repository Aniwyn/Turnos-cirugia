const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) { return res.status(403).json({ message: "Access denied. No token provided." }) }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // Agrega datos usuario al request
        next()
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}