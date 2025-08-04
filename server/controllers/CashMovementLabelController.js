const db = require('../models');

exports.getAllLabels = async (req, res) => {
  try {
    const labels = await db.CashMovementLabel.findAll()
    res.json(labels)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener etiquetas de movimiento de caja', error: err })
  }
}

exports.geLabelById = async (req, res) => {
  const { id } = req.params;
  try {
    const label = await db.CashMovementLabel.findByPk(id);
    if (!label) {
      return res.status(404).json({ message: 'Etiquetas de movimiento de caja no encontrada' })
    }
    res.json(label)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener etiquetas de movimiento de caja', error: err })
  }
}