const db = require('../config/db');

exports.getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        a.id,
        a.patient_id,
        admin_notes,
        a.nurse_notes,
        a.surgery_date,
        a.surgery_time,
        a.surgeon,
        p.first_name,
        p.last_name,
        p.doctor,
        p.phone1,
        p.phone2,
        p.email,
        p.health_insurance,
        sa.name AS admin_name,
        sa.color AS admin_color,
        sm.name AS medical_name,
        sm.color AS medical_color,
        s.name,
        appsur.intraocular_lens,
        appsur.eye
      FROM appointment a
      JOIN patient p ON a.patient_id = p.id
      JOIN administrative_status AS sa ON sa.id = a.admin_status_id
      JOIN medical_status AS sm ON sm.id = a.medical_status_id
      JOIN appointment_surgery AS appsur ON appsur.appointment_id = a.id
      JOIN surgery AS s ON s.id = appsur.surgery_id
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