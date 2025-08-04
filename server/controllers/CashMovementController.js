const db = require('../models')

exports.getAllCashMovements = async (req, res) => {
    try {
        const movements = await db.CashMovement.findAll({
            attributes: { exclude: ['label_id'] },
            include: [
                { association: 'label' }
            ]
        })
        res.json(movements)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener movimientos de caja', error: err })
    }
}

exports.getCashMovementById = async (req, res) => {
    const { id } = req.params
    try {
        const movement = await db.CashMovement.findByPk(id, {
            attributes: { exclude: ['label_id'] },
            include: [
                { association: 'label' }
            ]
        })
        if (!movement) {
            return res.status(404).json({ message: 'Movimiento de caja no encontrada' })
        }
        res.json(movement)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener movimiento de caja', error: err })
    }
}

exports.createCashMovement = async (req, res) => {
    try {
        const movement = req.body.movement
        const response = await db.CashMovement.create(movement)

        return res.status(201).json({ message: "Patient created", response: response })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Error creating patient", error: err })
    }
}


exports.updateCashMovement = async (req, res) => {
    try {
        const { id } = req.params
        const movementUpdates = req.body.movement

        const movement = await db.CashMovement.findByPk(id)
        if (!movement) { 
            return res.status(404).json({ message: 'Movimiento no encontrado' })
        }

        await movement.update(movementUpdates)
        res.json({ message: 'Movmiento actualizado' })
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar movimiento', error: err })
    }
}

exports.deleteCashMovement = async (req, res) => {
    try {
        const { id } = req.params

        const movement = await db.CashMovement.findByPk(id)
        if (!movement) { 
            return res.status(404).json({ message: 'Movimiento no encontrado' })
        }

        await movement.destroy()
        res.json({ message: 'Movmiento eliminado' })
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar movimiento', error: err })
    }
}