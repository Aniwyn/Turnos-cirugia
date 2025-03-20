const db = require("../config/db");

exports.getAllAdminStatuses = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM administrative_status");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estados administrativos", error: err });
  }
};

exports.getAdminStatusById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM administrative_status WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Estado administrativo no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estado administrativo", error: err });
  }
};

exports.createAdminStatus = async (req, res) => {
  const { name, color, notes } = req.body;
  try {
    const result = await db.execute(
      "INSERT INTO administrative_status (name, color, notes) VALUES (?, ?, ?)",
      [name, color, notes]
    );
    res.status(201).json({ message: "Estado administrativo creado", id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ message: "Error al crear estado administrativo", error: err });
  }
};

exports.updateAdminStatus = async (req, res) => {
  const { id } = req.params;
  const { name, color, notes } = req.body;
  try {
    const result = await db.execute(
      "UPDATE administrative_status SET name = ?, color = ?, notes = ? WHERE id = ?",
      [name, color, notes, id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Estado administrativo no encontrado" });
    }
    res.json({ message: "Estado administrativo actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar estado administrativo", error: err });
  }
};

exports.deleteAdminStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute("DELETE FROM administrative_status WHERE id = ?", [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Estado administrativo no encontrado" });
    }
    res.json({ message: "Estado administrativo eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar estado administrativo", error: err });
  }
};