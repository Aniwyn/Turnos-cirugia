const db = require('../models')

exports.getAllStudyOrderStatuses = async (req, res) => {
    try {
        const statuses = await db.StudyOrderStatus.findAll()
        res.json(statuses)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener estados de órdenes de estudio', error: err })
    }
}