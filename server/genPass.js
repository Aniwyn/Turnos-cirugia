const bcrypt = require("bcryptjs")

const password = "Saron1918"
const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Error generando hash:", err)
    } else {
        console.log(`Hash generado para la contraseña "${password}": `, hash)
    }
})
