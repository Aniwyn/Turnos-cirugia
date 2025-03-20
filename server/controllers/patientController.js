const db = require('../config/db');

exports.getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM patient');
    res.status(200).json({
      meta: {
        url: req.protocol + '://' + req.get('host') + req.url,
        status: 200,
      },
      data: rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener pacientes', error: err });
  }
};

exports.getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM patient WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el paciente', error: err });
  }
};

exports.createPatient = async (req, res) => {
  const { first_name, last_name, phone1, phone2, health_insurance } = req.body;
  try {
    const result = await db.execute(
      'INSERT INTO patient (first_name, last_name, phone1, phone2, health_insurance) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, phone1, phone2, health_insurance]
    );
    res.status(201).json({ message: 'Paciente creado', patientId: result[0].insertId });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear paciente', error: err });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone1, phone2, health_insurance } = req.body;
  try {
    const result = await db.execute(
      'UPDATE patient SET first_name = ?, last_name = ?, phone1 = ?, phone2 = ?, health_insurance = ? WHERE id = ?',
      [first_name, last_name, phone1, phone2, health_insurance, id]
    );
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar paciente', error: err });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute('DELETE FROM patient WHERE id = ?', [id]);
    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar paciente', error: err });
  }
};
