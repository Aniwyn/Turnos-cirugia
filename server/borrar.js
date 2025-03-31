const bcrypt = require("bcrypt");

const password = "12345"; // Reemplázala con la que quieras hashear
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Error generando hash:", err);
    } else {
        console.log("Hash generado:", hash);
    }
});