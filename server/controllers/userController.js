const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const db = require("../models")
const logAudit = require('../services/auditLogger')
require("dotenv").config()

exports.login = async (req, res) => {
    const { name, password } = req.body
    const lowerName = name.toLowerCase()
    const audit = {
        action: '[POST] LOGIN_ATTEMPT',
        affected_entity: 'user'
    }

    try {
        const user = await db.User.findOne({ where: { name: lowerName } })

        if (!user) { 
            audit.error = `Usuario no encontrado: ${lowerName}`
            await logAudit(audit)
            return res.status(404).json({ message: "User not found" }) 
        }

        audit.user_id = user.id
        audit.record_id = user.id

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) { 
            audit.error = `Contraseña incorrecta para el usuario: ${user.name}`
            await logAudit(audit)
            return res.status(401).json({ message: "Invalid credentials" }) 
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "6h" }
        )
        
        audit.action = '[POST] LOGIN_SUCCESSFUL'
        await logAudit(audit) 

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, role: user.role }
        })

    } catch (error) {
        audit.error = error.message
        await logAudit(audit)
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