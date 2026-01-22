const db = require('../models')

exports.getAllStudyOrderItemStatuses = async (req, res) => {
    try {
        const statuses = await db.StudyOrderItemStatus.findAll()
        res.json(statuses)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener estados de items de órdenes de estudio', error: err })
    }
}