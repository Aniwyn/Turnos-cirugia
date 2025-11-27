const db = require('../models')
const { Op } = require('sequelize')

const defaultPage = 1
const defaultLimit = 10

exports.getAllAccountingLedger = async (req, res) => {
    try {
        const accountingLedger = await db.AccountingLedger.findAll()
        res.json(accountingLedger)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener estados contables', error: err })
    }
}

exports.getPaginatedAccountingLedger = async (req, res) => {
    try {
        const { query = {}, page = defaultPage, limit = defaultLimit } = req.query

        const offset = (page - 1) * limit
        const whereConditions = []

        //CONDICIONES DE EJEMPLO, CAMBIAR
        if (query.id) { whereConditions.push({ id: { [Op.like]: `%${query.id}%` } }) }
        if (query.dni) { whereConditions.push({ dni: { [Op.like]: `%${query.dni}%` } }) }
        if (query.last_name) { whereConditions.push({ last_name: { [Op.like]: `%${query.last_name}%` } }) }
        if (query.first_name) { whereConditions.push({ first_name: { [Op.like]: `%${query.first_name}%` } }) }
        if (query.health_insurance) { whereConditions.push({ health_insurance: { [Op.like]: `%${query.health_insurance}%` } }) }

        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const { count, rows } = await db.AccountingLedger.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['transaction_date', 'DESC']],
            include: [
                {
                    model: db.MainBox,
                    as: 'associatedMainBox'
                }
            ]
        })

        const totalPages = Math.ceil(count / limit)

        res.json({
            data: rows,
            page: parseInt(page),
            totalPages,
            totalItems: count
        })
    } catch (err) {
        console.error('Error al obtener el libro contable paginado:', err)
        res.status(500).json({ message: 'Error interno del servidor al obtener el libro contable paginado.' })
    }
}

exports.getAccountingLedgerByDateRange = async (req, res) => {
    try {
        const { start_date, end_date } = req.query

        let endDate = end_date ? new Date(end_date) : new Date()
        endDate.setHours(23, 59, 59, 999)

        let startDate = start_date ? new Date(start_date) : new Date(endDate)
        if (!start_date) {
            startDate.setDate(startDate.getDate() - 30)
        }
        startDate.setHours(0, 0, 0, 0)

        if (startDate > endDate) {
            [startDate, endDate] = [endDate, startDate]
        }


        const accountingLedger = await db.AccountingLedger.findAll({
            where: {
                transaction_date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['transaction_date', 'ASC']]
        })

        res.json({
            range: {
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0]
            },
            count: accountingLedger.length,
            data: accountingLedger
        })
    } catch (err) {
        console.error('Error al obtener estados contables por rango: ', err)
        res.status(500).json({ message: 'Error interno del servidor al obtener estados contables por rango.' })
    }
}

exports.getLastAccountingLedger = async (req, res) => {
    try {
        const lastEntry = await db.AccountingLedger.findOne({
            order: [['transaction_date', 'DESC']]
        })

        if (!lastEntry) {
            return res.status(404).json({ message: 'No se encontraron registros contables.' })
        }

        res.json(lastEntry)
    } catch (err) {
        console.error('Error al obtener el último registro contable: ', err)
        res.status(500).json({ message: 'Error interno del servidor al obtener el último registro contable.' })
    }
}
