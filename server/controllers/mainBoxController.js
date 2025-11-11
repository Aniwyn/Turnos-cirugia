const { Op } = require('sequelize')
const db = require('../models')

const defaultPage = 1
const defaultLimit = 20

exports.getAllMainBoxes = async (req, res) => {
    try {
        const userId = req.user.userId

        const user = await db.User.findByPk(userId)
        if (user?.role !== 'accountant' && user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' })
        }

        const mainBoxes = await db.MainBox.findAll({
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                }
            ]
        })

        res.json(mainBoxes)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener cajas', error: err })
    }
}

exports.getPaginatedMainBoxes = async (req, res) => {
    const { query: filters = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const userId = req.user.userId

        const user = await db.User.findByPk(userId)
        if (user?.role !== 'accountant' && user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' })
        }

        const { id, start_date, end_date } = filters
        const whereConditions = []

        if (id) { whereConditions.push({ id: { [Op.like]: `%${id}%` } }) }
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
        const { rows, count } = await db.MainBox.findAndCountAll({
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
            mainBoxes: rows,
            total: count,
            page: pageNumber,
            totalPages: Math.ceil(count / limitNumber)
        })
    } catch (err) {
        console.error("Error en getPaginatedMainBoxes: ", err)
        res.status(500).json({ message: 'Error al obtener cajas principales', error: err })
    }
}

exports.getMyActiveMainBox = async (req, res) => {
    try {
        const userId = req.user.userId

        const user = await db.User.findByPk(userId)
        //Solo para test, borrar role = admin
        if (user?.role !== 'accountant' && user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access Denied' })
        }

        const [openMainBox, created] = await db.MainBox.findOrCreate({
            where: {
                user_id: userId,
                state: 'open'
            },
            defaults: {
                user_id: userId,
                state: 'open'
            }
        })

        return res.status(created ? 201 : 200).json(openMainBox)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error obteniendo la caja general activa' })
    }
}

exports.getCashBoxesForMainBox = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId

        const user = await db.User.findByPk(userId)
        const mainBox = await db.MainBox.findByPk(id)

        if (mainBox.user_id !== user.id) res.status(403).json({ message: 'Access Denied' })

        const cashBoxes = await db.CashBox.findAll({
            where: {
                main_box_id: id
            },
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                },
            ],
        })

        return res.json(cashBoxes)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error obteniendo las cajas de la caja general' })
    }
}

exports.getMainBoxById = async (req, res) => {
    const { id } = req.params

    try {
        const box = await db.MainBox.findByPk(id, {
            include: [
                {
                    association: 'user',
                    attributes: ['name', 'role']
                }
            ]
        })
        if (!box) {
            return res.status(404).json({ message: 'Caja general no encontrada' })
        }
        res.status(200).json(box)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener caja general', error: err })
    }
}

exports.closeMainBox = async (req, res) => {
    const { id } = req.params
    const userId = req.user.userId

    try {
        const user = await db.User.findByPk(userId)
        const mainBox = await db.MainBox.findByPk(id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!mainBox) {
            return res.status(404).json({ message: 'MainBox not found' })
        }

        if (mainBox.user_id !== user.id) {
            return res.status(403).json({ message: 'Access Denied' })
        }

        const cashBoxes = await db.CashBox.findAll({
            where: {
                main_box_id: id
            }
        })

        const totalARS = cashBoxes.reduce((sum, box) => sum + (parseFloat(box.total_ars) || 0), 0)
        const totalUSD = cashBoxes.reduce((sum, box) => sum + (parseFloat(box.total_usd) || 0), 0)

        mainBox.state = 'closed'
        mainBox.closed_at = new Date()
        mainBox.total_ars = totalARS
        mainBox.total_usd = totalUSD
        await mainBox.save()

        const newMainBox = await db.MainBox.create({ user_id: userId, state: 'open' })

        return res.status(200).json(mainBox)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Error cerrando la caja general' })
    }
}