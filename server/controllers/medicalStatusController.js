const db = require('../models');

exports.getAllMedicalStatuses = async (req, res) => {
  try {
    const medicalStatuses = await db.MedicalStatus.findAll();
    res.json(medicalStatuses);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estados médicos', error: err });
  }
};

exports.getMedicalStatusById = async (req, res) => {
  const { id } = req.params;
  try {
    const medicalStatus = await db.MedicalStatus.findByPk(id);
    if (!medicalStatus) {
      return res.status(404).json({ message: 'Estado médico no encontrado' });
    }
    res.json(medicalStatus);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener estado médico', error: err });
  }
};
