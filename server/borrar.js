const bcrypt = require("bcryptjs");

const password = "12345";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error("Error generando hash:", err);
    } else {
        console.log("Hash generado:", hash);
    }
});

/** Podrias ayudarme? tengo un proyecto que estaba trabajadno en github y por ciertos motivos tuve que sacar una copia para trabajar offline, en esta copia borre node_module y .git, ahora necesito volver a subir el repositorio a github */