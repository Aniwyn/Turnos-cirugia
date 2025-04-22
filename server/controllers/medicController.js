const db = require('../models');

exports.getAllAMedics = async (req, res) => {
  try {
    const medics = await db.Medic.findAll();
    res.json(medics);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener médicos', error: err });
  }
};

exports.geMedicById = async (req, res) => {
  const { id } = req.params;
  try {
    const medic = await db.Medic.findByPk(id);
    if (!medic) {
      return res.status(404).json({ message: 'Estado médico no encontrado' });
    }
    res.json(medic);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener médico', error: err });
  }
};