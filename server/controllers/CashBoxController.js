const { Op } = require('sequelize')
const db = require('../models')

const defaultPage = 1
const defaultLimit = 20

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

exports.getPaginatedCashBoxes = async (req, res) => {
    const { query: filters = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const userId = req.user.userId

        const user = await db.User.findByPk(userId)

        const { id, start_date, end_date, description} = filters
        const whereConditions = []

        if (id) { whereConditions.push({ id: { [Op.like]: `%${id}%` } }) }
        if (description) { whereConditions.push({ description: { [Op.like]: `%${description}%` } }) }
        if (start_date || end_date) {
            const dateFilter = {}

            if (start_date) {
                dateFilter[Op.gte] = new Date(start_date)
            }

            if (end_date) {
                const [year, month, day] = end_date.split('-').map(Number)
                const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
                dateFilter[Op.lte] = end
            }

            whereConditions.push({
                closed_at: dateFilter
            })
        }


        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const pageNumber = parseInt(page, 10) || defaultPage
        const limitNumber = parseInt(limit, 10) || defaultLimit

        const offset = (pageNumber - 1) * limitNumber
        const { rows, count } = await db.CashBox.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
            order: [['id', 'DESC']],
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                }
            ]
        })

        res.json({
            boxes: rows,
            total: count,
            page: pageNumber,
            totalPages: Math.ceil(count / limitNumber)
        })
    } catch (err) {
        console.error("Error en getPaginatedCashBoxes: ", err)
        res.status(500).json({ message: 'Error al obtener cajas', error: err })
    }
}

exports.getMyActiveCashBox = async (req, res) => {
    try {
        const userId = req.user.userId

        const openBox = await db.CashBox.findOne({
            where: {
                user_id: userId,
                state: 'open'
            }
        })

        if (!openBox) { return res.status(404).json({ message: 'ERROR: No se encontraron cajas activas para el usuario.' }) }

        return res.json(openBox)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error obteniendo la caja activa' })
    }
}

exports.getUserCashBoxesPaginated = async (req, res) => {
    const { query: filters = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const userId = req.user.userId

        const { id, start_date, end_date, description } = filters
        const whereConditions = []
        console.log(filters)
        if (userId) { whereConditions.push({ user_id: userId }) }
        if (id) { whereConditions.push({ id: { [Op.like]: `%${id}%` } }) }
        if (description) { whereConditions.push({ description: { [Op.like]: `%${description}%` } }) }
        if (start_date || end_date) {
            const dateFilter = {}

            if (start_date) {
                dateFilter[Op.gte] = new Date(start_date)
            }

            if (end_date) {
                const [year, month, day] = end_date.split('-').map(Number)
                const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
                dateFilter[Op.lte] = end
            }

            whereConditions.push({
                closed_at: dateFilter
            })
        }


        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const pageNumber = parseInt(page, 10) || defaultPage
        const limitNumber = parseInt(limit, 10) || defaultLimit

        const offset = (pageNumber - 1) * limitNumber
        const { rows, count } = await db.CashBox.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
            order: [['id', 'DESC']],
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                }
            ]
        })

        res.json({
            boxes: rows || [],
            total: count,
            page: pageNumber,
            totalPages: Math.ceil(count / limitNumber)
        })
    } catch (err) {
        console.error("Error en getPaginatedCashBoxes: ", err)
        res.status(500).json({ message: 'Error al obtener cajas', error: err })
    }
}

exports.getCashBoxById = async (req, res) => {
    const { id } = req.params
    try {
        const box = await db.CashBox.findByPk(id, {
            include: [
                { association: 'cashMovement' },
                {
                    association: 'user',
                    attributes: ['name', 'role']
                },
            ]
        })
        if (!box) {
            return res.status(404).json({ message: 'Caja no encontrada' })
        }
        res.status(200).json(box)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener caja', error: err })
    }
}

exports.getAvailableForMainBox = async (req, res) => {
    try {
        const boxes = await db.CashBox.findAll({
            where: {
                state: "closed",
                main_box_id: null
            },
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                },
            ]
        })
        
        res.status(200).json(boxes)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las cajas disponible', error: err })
    }
}

//Se debería editar?
exports.createCashBox = async (req, res) => { }
exports.updateCashBox = async (req, res) => { }

exports.linkMainBox = async (req, res) => {
    try {
        const { id } = req.params
        const { mainBoxId } = req.body

        console.log(id, "  ", mainBoxId)

        const cashBox = await db.CashBox.findByPk(id)

        if (!cashBox) {
            return res.status(404).json({ message: 'Cash box not found' })
        }

        cashBox.main_box_id = mainBoxId
        await cashBox.save()

        res.status(200).json({ message: 'Main box linked successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error linked main box' })
    }
}

exports.unlinkMainBox = async (req, res) => {
    try {
        const { id } = req.params

        const cashBox = await db.CashBox.findByPk(id)

        if (!cashBox) {
            return res.status(404).json({ message: 'Cash box not found' })
        }

        cashBox.main_box_id = null
        await cashBox.save()

        res.status(200).json({ message: 'Main box unlinked successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error unlinking main box' })
    }
}


exports.closeCashBox = async (req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const userId = req.user.userId
        const userName = req.user.name

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

exports.deleteCashBox = async (req, res) => { }