const db = require("../config/db");

exports.getAllMedicalStatuses = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM medical_status");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estados médicos", error: err });
  }
};

exports.getMedicalStatusById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM medical_status WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Estado médico no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener estado médico", error: err });
  }
};

exports.createMedicalStatus = async (req, res) => {
  const { name, color, notes } = req.body;
  try {
    const result = await db.execute(
      "INSERT INTO medical_status (name, color, notes) VALUES (?, ?, ?)",
      [name, color, notes]
    );
    res.status(201).json({ message: "Estado médico creado", id: result[0].insertId });
  } catch (err) {
    res.status(500).json({ message: "Error al crear estado médico", error: err });
  }
};

exports.updateMedicalStatus = async (req, res) => {
  const { id } = req.params;
  const { name, color, notes } = req.body;
  try {
    const result = await db.execute(
      "UPDATE medical_status SET name = ?, color = ?, notes = ? WHERE id = ?",
      [name, color, notes, id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Estado médico no encontrado" });
    }
    res.json({ message: "Estado médico actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar estado médico", error: err });
  }
};

exports.deleteMedicalStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute("DELETE FROM medical_status WHERE id = ?", [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Estado médico no encontrado" });
    }
    res.json({ message: "Estado médico eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar estado médico", error: err });
  }
};