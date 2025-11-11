const db = require('../models')

//listo para borrar
exports.getAllDailySummaryEX = async (req, res) => {
    try {
        const dailySummaries = await db.DailySummary.findAll()
        res.json(dailySummaries)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener cajas', error: err })
    }
}

//listo para borrar
exports.getDailySummaryByIdEX = async (req, res) => {
    const { id } = req.params
    try {
        const dailySummary = await db.DailySummary.findByPk(id)

        if (!dailySummary) {
            return res.status(404).json({ message: 'Caja no encontrada' })
        }
        
        res.json(dailySummary)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener caja', error: err })
    }
}

exports.getAllDailySummaryEX = async (req, res) => { }

exports.getDailySummaryByIdEX = async (req, res) => { }

exports.createDailySummary = async (req, res) => { }

exports.updateDailySummary = async (req, res) => { }

exports.deleteDailySummary = async (req, res) => { }