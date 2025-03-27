const db = require('../models');

exports.getAllSurgery = async (req, res) => {
  try {
    const surgery = await db.Surgery.findAll();
    res.json(surgery);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cirugias', error: err });
  }
};

exports.getSurgeryById = async (req, res) => {
  const { id } = req.params;
  try {
    const surgery = await db.Surgery.findByPk(id);
    if (!surgery) {
      return res.status(404).json({ message: 'Cirugía no encontrada' });
    }
    res.json(surgery);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cirugias', error: err });
  }
};
