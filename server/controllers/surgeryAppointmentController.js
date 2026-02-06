const { Op } = require('sequelize')
const db = require('../models')
// const { createOrUpdatePatient, createAppointment, updateAppointment } = require('../services/appointmentService.js')
// const logAudit = require('../services/auditLogger')

const defaultPage = 1
const defaultLimit = 20

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await db.Appointment.findAll({
            include: [
                {
                    association: 'Patient',
                    include: [
                        { association: 'Medic' }
                    ]
                },
                { association: 'MedicalStatus' },
                { association: 'AdministrativeStatus' },
                { association: 'Medic' },
                { association: 'AdminUser', attributes: ['name'] },
                { association: 'MedicalUser', attributes: ['name'] },
                {
                    association: 'Surgeries',
                    through: {
                        attributes: ['id', 'intraocular_lens', 'eye']
                    }
                }
            ],
            where: {
                state: 1,
                success: 1
            },
            order: [
                ['id', 'DESC']
            ]
        })
        res.json(appointments)
    } catch (err) {
        console.error("ERROR: ", err)
        res.status(500).json({ message: 'Error al obtener turnos', error: err })
    }
}

exports.getPaginatedAppointments = async (req, res) => {
    const { query = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const offset = (page - 1) * limit
        const whereConditions = [{ state: 1, success: 1 }]
        const patientWhereConditions = []

        if (query.surgery_date) { whereConditions.push({ surgery_date: query.surgery_date }) }

        if (query.patient_dni) { patientWhereConditions.push({ dni: { [Op.like]: `%${query.patient_dni}%` } }) }
        if (query.patient_last_name) { patientWhereConditions.push({ last_name: { [Op.like]: `%${query.patient_last_name}%` } }) }
        if (query.patient_first_name) { patientWhereConditions.push({ first_name: { [Op.like]: `%${query.patient_first_name}%` } }) }

        const whereClause = { [Op.and]: whereConditions }
        const patientWhereClause = patientWhereConditions.length > 0 ? { [Op.and]: patientWhereConditions } : undefined

        const { rows, count } = await db.Appointment.findAndCountAll({
            where: whereClause,
            offset,
            limit: parseInt(limit),
            distinct: true,
            order: [
                ['id', 'DESC']
            ],
            include: [
                {
                    association: 'Patient',
                    where: patientWhereClause,
                    required: !!patientWhereClause,
                    include: [
                        { association: 'Medic' }
                    ]
                },
                { association: 'MedicalStatus' },
                { association: 'AdministrativeStatus' },
                { association: 'Medic' },
                { association: 'AdminUser', attributes: ['name'] },
                { association: 'MedicalUser', attributes: ['name'] },
                {
                    association: 'Surgeries',
                    through: {
                        attributes: ['id', 'intraocular_lens', 'eye']
                    }
                }
            ]
        })

        res.json({
            appointments: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        console.error("Error en getPaginatedAppointments: ", err)
        res.status(500).json({ message: 'Error al obtener turnos paginados', error: err })
    }
}

exports.getFilteredAppointments = async (req, res) => {
    const { query = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const offset = (page - 1) * limit
        const whereConditions = [{ state: 1, success: 1 }]
        const patientWhereConditions = []

        if (query.surgery_date) { whereConditions.push({ surgery_date: query.surgery_date }) }

        if (query.patient_dni) { patientWhereConditions.push({ dni: { [Op.like]: `%${query.patient_dni}%` } }) }
        if (query.patient_last_name) { patientWhereConditions.push({ last_name: { [Op.like]: `%${query.patient_last_name}%` } }) }
        if (query.patient_first_name) { patientWhereConditions.push({ first_name: { [Op.like]: `%${query.patient_first_name}%` } }) }

        const whereClause = { [Op.and]: whereConditions }
        const patientWhereClause = patientWhereConditions.length > 0 ? { [Op.and]: patientWhereConditions } : undefined

        const { rows, count } = await db.Appointment.findAndCountAll({
            where: whereClause,
            offset,
            limit: parseInt(limit),
            distinct: true,
            order: [
                ['id', 'DESC']
            ],
            include: [
                {
                    association: 'Patient',
                    where: patientWhereClause,
                    required: !!patientWhereClause,
                    include: [
                        { association: 'Medic' }
                    ]
                },
                { association: 'MedicalStatus' },
                { association: 'AdministrativeStatus' },
                { association: 'Medic' },
                { association: 'AdminUser', attributes: ['name'] },
                { association: 'MedicalUser', attributes: ['name'] },
                {
                    association: 'Surgeries',
                    through: {
                        attributes: ['id', 'intraocular_lens', 'eye']
                    }
                }
            ]
        })

        res.json({
            appointments: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        console.error('Error en getFilteredAppointments:', err)
        res.status(500).json({ message: 'No se pudo obtener turnos filtrados', error: err })
    }
}