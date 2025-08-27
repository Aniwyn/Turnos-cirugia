const db = require('../models')

exports.getAllCashBox = async (req, res) => {
    try {
        //{ association: 'cashMovement' }, volver a poner si hace falta
        const boxes = await db.CashBox.findAll({
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                }
            ]
        })

        res.json(boxes)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener cajas', error: err })
    }
}

exports.getUserCashBoxes = async (req, res) => {
    const user = req.user

    try {
        const userId = req.user.userId

        const boxes = await db.CashBox.findAll({
            where: { user_id: userId },
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                },
            ],
            order: [['created_at', 'DESC']]
        })

        res.json(boxes)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener cajas del usuario', error: err })
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

exports.closeCashBoxold = async (req, res) => {
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

exports.closeCashBox = async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const userId = req.user.userId
        const userName = req.user.name
        console.log("\n\n", req.user, "\n\n")

        const cashBox = await db.CashBox.findByPk(id, {
            include: [{ association: 'cashMovement' }]
        })

        //Clausulas inhabilitantes
        if (!cashBox) return res.status(404).json({ message: 'Caja no encontrada.' })
        if (cashBox.user_id !== userId) return res.status(403).json({ message: 'No tienes permiso para cerrar esta caja.' })
        if (cashBox.state === 'closed') return res.status(400).json({ message: 'La caja ya está cerrada.' })

        let totalARS = 0
        let totalUSD = 0
        for (const mov of cashBox.cashMovement) {
            if (mov.currency === 'ARS') {
                totalARS += mov.type === 'income' ? parseFloat(mov.amount) : -parseFloat(mov.amount)
            } else if (mov.currency === 'USD') {
                totalUSD += mov.type === 'income' ? parseFloat(mov.amount) : -parseFloat(mov.amount)
            }
        }

        await db.CashMovement.update(
            { closed: 1 },
            { where: { cash_box_id: id } }
        )

        cashBox.state = 'closed'
        cashBox.description = description
        cashBox.closed_at = new Date()
        cashBox.total_ars = totalARS
        cashBox.total_usd = totalUSD
        await cashBox.save()

        const newBox = await db.CashBox.create({
            user_id: userId,
            state: 'open',
            created_at: new Date(),
            description: `Caja de ${userName}`
        })

        return res.status(200).json({
            message: 'Caja cerrada correctamente',
            closedBox: cashBox,
            newBox
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error al cerrar caja' })
    }
}

exports.getMyOpenCashBox = async (req, res) => {
    try {
        const userId = req.user.userId

        const openBox = await db.CashBox.findOne({
            where: {
                user_id: userId,
                state: 'open'
            }
        })

        if (!openBox) { return res.status(404).json({ message: 'ERROR: No tienes una caja abierta.' }) }

        return res.json(openBox)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error obteniendo la caja abierta' })
    }
}

exports.deleteCashBox = async (req, res) => { }