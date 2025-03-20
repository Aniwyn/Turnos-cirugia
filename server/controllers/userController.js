const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, role FROM user");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios", error: err });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT id, name, role FROM user WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuario", error: err });
  }
};

exports.createUser = async (req, res) => {
  const { name, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.execute(
      "INSERT INTO user (name, role, password_hash) VALUES (?, ?, ?)",
      [name, role, hashedPassword]
    );
    res.status(201).json({ message: "Usuario creado", userId: result[0].insertId });
  } catch (err) {
    res.status(500).json({ message: "Error al crear usuario", error: err });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;
  try {
    const result = await db.execute("UPDATE user SET name = ?, role = ? WHERE id = ?", [name, role, id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario", error: err });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute("DELETE FROM user WHERE id = ?", [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario", error: err });
  }
};

exports.login = async (req, res) => {
  const { name, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM user WHERE name = ?", [name]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // token JWT ---REVISAR---
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (err) {
    res.status(500).json({ message: "Error en el inicio de sesión", error: err });
  }
};