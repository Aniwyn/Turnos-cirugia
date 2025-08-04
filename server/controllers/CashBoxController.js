const db = require('../models')

exports.getAllCashBox = async (req, res) => {
    try {
        const boxes = await db.CashBox.findAll({
            include: [
                { association: 'cashMovement' }
            ]
        })
        res.json(boxes)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener cajas', error: err })
    }
}

exports.getCashBoxById = async (req, res) => {
    const { id } = req.params
    try {
        const box = await db.CashBox.findByPk(id, {
            include: [
                { association: 'cashMovement' }
            ]
        })
        if (!box) {
            return res.status(404).json({ message: 'Caja no encontrada' })
        }
        res.json(box)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener caja', error: err })
    }
}

exports.createCashBox = async (req, res) => { }

exports.updateCashBox = async (req, res) => { }

exports.closeCashBox = async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body

        const cashBox = await db.CashBox.findByPk(id)

        if (!cashBox)
            return res.status(404).json({ message: 'Caja no encontrada' })

        if (cashBox.state === 'closed')
            return res.status(400).json({ message: 'La caja ya está cerrada' })

        await cashBox.update({ description, state: "closed", closed_at: new Date() })

        res.json({ message: 'Caja cerrada exitosamente' })
    } catch (err) {
        res.status(500).json({ message: 'Error al cerrar caja', error: err })
    }
}

exports.deleteCashBox = async (req, res) => { }