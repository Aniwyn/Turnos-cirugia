const db = require('../config/db');

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT a.*, p.first_name, p.last_name
      FROM appointment a
      JOIN patient p ON a.patient_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener turnos', error: err });
  }
};

exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(`
      SELECT a.*, p.first_name, p.last_name
      FROM appointment a
      JOIN patient p ON a.patient_id = p.id
      WHERE a.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el turno', error: err });
  }
};

exports.createAppointment = async (req, res) => {
  const { patient_id, surgery, intraocular_lens, admin_status_id, medical_status_id, admin_notes, nurse_notes } = req.body;
  try {
    const result = await db.execute(
      `INSERT INTO appointment 
        (patient_id, surgery, intraocular_lens, admin_status_id, medical_status_id, admin_notes, nurse_notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [patient_id, surgery, intraocular_lens, admin_status_id, medical_status_id, admin_notes, nurse_notes]
    );
    res.status(201).json({ message: 'Turno creado', appointmentId: result[0].insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear turno', error: err });
  }
};

exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { patient_id, surgery, intraocular_lens, admin_status_id, medical_status_id, admin_notes, nurse_notes } = req.body;
  try {
    const result = await db.execute(
      `UPDATE appointment 
      SET patient_id = ?, surgery = ?, intraocular_lens = ?, admin_status_id = ?, medical_status_id = ?, admin_notes = ?, nurse_notes = ? 
      WHERE id = ?`,
      [patient_id, surgery, intraocular_lens, admin_status_id, medical_status_id, admin_notes, nurse_notes, id]
    );

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json({ message: 'Turno actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar turno', error: err });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute('DELETE FROM appointment WHERE id = ?', [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }
    res.json({ message: 'Turno eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar turno', error: err });
  }
};