const bcrypt = require("bcryptjs");

const password = "CO45jujuy!";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Error generando hash:", err);
    } else {
        console.log("Hash generado:", hash);
    }
});