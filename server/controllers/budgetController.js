const { Op } = require('sequelize')
const db = require('../models')

const defaultPage = 1
const defaultLimit = 20

exports.getAllBudget = async (req, res) => {
    try {
        const budgets = await db.Budget.findAll({ include: [{ association: 'items' }] })
        res.status(200).json(budgets)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener presupuestos', error: err })
    }
}

exports.getPaginatedBudgets = async (req, res) => {
    const { query = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const offset = (page - 1) * limit
        const whereConditions = []

        if (query.patient_name) { whereConditions.push({ patient_name: { [Op.like]: `%${query.patient_name}%` } }) }
        if (query.patient_last_name) { whereConditions.push({ patient_name: { [Op.like]: `%${query.patient_last_name}%` } }) }
        if (query.patient_dni) { whereConditions.push({ patient_dni: { [Op.like]: `%${query.patient_dni}%` } }) }
        if (query.budget_date) {
            const startOfDay = new Date(query.budget_date)
            const endOfDay = new Date(query.budget_date)
            whereConditions.push({ budget_date: { [Op.between]: [startOfDay, endOfDay] } })
        }

        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const { rows, count } = await db.Budget.findAndCountAll({
            where: whereClause,
            offset,
            distinct: true,
            col: 'id',
            // subQuery: false,
            limit: parseInt(limit),
            order: [['id', 'DESC']],
            include: [{ association: 'items' }]
        })

        res.json({
            budgets: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        console.error("Error en getPaginatedBudgets: ", err)
        res.status(500).json({ message: 'Error al obtener presupuestos paginados', error: err })
    }
}

exports.getFilteredBudgets = async (req, res) => {
    try {
        const { query = {}, page = defaultPage, limit = defaultLimit } = req.query
        const offset = (page - 1) * limit
        const whereConditions = []

        if (query.patient_name) { whereConditions.push({ patient_name: { [Op.like]: `%${query.patient_name}%` } }) }
        if (query.patient_last_name) { whereConditions.push({ patient_name: { [Op.like]: `%${query.patient_last_name}%` } }) }
        if (query.patient_dni) { whereConditions.push({ patient_dni: { [Op.like]: `%${query.patient_dni}%` } }) }
        
        if (query.budget_date) {
            const startOfDay = new Date(query.budget_date)
            const endOfDay = new Date(query.budget_date)
            whereConditions.push({ budget_date: { [Op.between]: [startOfDay, endOfDay] } })
        }

        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const { rows, count } = await db.Budget.findAndCountAll({
            where: whereClause,
            distinct: true,
            col: 'id',
            subQuery: false,
            offset,
            limit: parseInt(limit),
            order: [['id', 'DESC']],
            include: [{ association: 'items' }]
        })

        res.json({
            budgets: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        console.error('Error en getFilteredBudgets:', err)
        res.status(500).json({ message: 'No se pudo obtener presupuestos filtrados', error: err })
    }
}

exports.getBudgetByID = async (req, res) => {
    try {
        const { id } = req.params

        const budget = await db.Budget.findByPk(id, { include: [{ association: 'items' }] })

        if (!budget) {
            return res.status(404).json({ message: 'Presupuesto no encontrado' })
        }

        res.status(200).json(budget)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener presupuesto' })
    }
}

exports.createBudget = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { patient_id, patient_dni, patient_name, budget_date, validity_days, recipient, extra_line, total, items } = req.body
        const responsible_id = req.user.userId
        const responsible_name = req.user.name

        console.log(req.body)

        const budget = await db.Budget.create(
            { patient_id, patient_dni, patient_name, budget_date, validity_days, recipient, extra_line, total, responsible_id, responsible_name },
            { transaction: t }
        )

        if (items && items.length > 0) {
            for (const item of items) {
                await db.BudgetItem.create(
                    {
                        budget_id: budget.id,
                        practice_id: item.practice_id,
                        practice_name: item.practice_name,
                        eye: item.eye,
                        quantity: item.quantity,
                        price: item.price,
                        iva: item.iva,
                        code: item.code,
                        module: item.module
                    },
                    { transaction: t }
                )
            }
        }

        await t.commit()

        const savedBudget = await db.Budget.findByPk(budget.id, {
            include: [{ association: 'items' }]
        })
        res.status(201).json(savedBudget)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al crear presupuesto' })
    }
}