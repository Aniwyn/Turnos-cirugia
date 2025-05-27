const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../models")
require("dotenv").config()

exports.login = async (req, res) => {
    const { name, password } = req.body
    const lowerName = name.toLowerCase()

    try {
        const user = await db.User.findOne({ where: { name: lowerName } })

        if (!user) { return res.status(404).json({ message: "User not found" }) }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) { return res.status(401).json({ message: "Invalid credentials" }) }

        const token = jwt.sign(
            { userId: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "6h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error("Error in login:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

exports.getAuthenticatedUser = async (req, res) => {
    try {
        const token = req.header("Authorization")
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET)
        const user = await db.User.findByPk(decoded.userId, {
            attributes: ["id", "name", "role"]
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
};