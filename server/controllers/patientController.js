const { Op } = require('sequelize')
const db = require('../models')
const logAudit = require('../services/auditLogger')

const defaultPage = 1
const defaultLimit = 20

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await db.Patient.findAll({
            include: [
                { association: 'Medic' }
            ],
            order: [['id', 'DESC']]
        })

        res.status(200).json(patients)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener pacientes', error: err })
    }
}

exports.getPaginatedPatients = async (req, res) => {
    const { query = {}, page = defaultPage, limit = defaultLimit } = req.query
    try {
        const offset = (page - 1) * limit

        const whereConditions = []

        if (query.id) { whereConditions.push({ id: { [Op.like]: `%${query.id}%` } }) }
        if (query.dni) { whereConditions.push({ dni: { [Op.like]: `%${query.dni}%` } }) }
        if (query.last_name) { whereConditions.push({ last_name: { [Op.like]: `%${query.last_name}%` } }) }
        if (query.first_name) { whereConditions.push({ first_name: { [Op.like]: `%${query.first_name}%` } }) }
        if (query.health_insurance) { whereConditions.push({ health_insurance: { [Op.like]: `%${query.health_insurance}%` } }) }

        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const { rows, count } = await db.Patient.findAndCountAll({
            where: whereClause,
            offset,
            limit: parseInt(limit),
            order: [['id', 'DESC']]
        })

        res.json({
            patients: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        console.error("Error en getPaginatedPatients: ", err)
        res.status(500).json({ message: 'Error al obtener pacientes', error: err })
    }
}

exports.getFilteredPatients = async (req, res) => {
    try {
        const { query = {}, page = defaultPage, limit = defaultLimit } = req.query
        const offset = (page - 1) * limit

        const whereConditions = []

        if (query.id) { whereConditions.push({ id: { [Op.like]: `%${query.id}%` } }) }
        if (query.dni) { whereConditions.push({ dni: { [Op.like]: `%${query.dni}%` } }) }
        if (query.last_name) { whereConditions.push({ last_name: { [Op.like]: `%${query.last_name}%` } }) }
        if (query.first_name) { whereConditions.push({ first_name: { [Op.like]: `%${query.first_name}%` } }) }
        if (query.health_insurance) { whereConditions.push({ health_insurance: { [Op.like]: `%${query.health_insurance}%` } }) }

        const whereClause = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}

        const { rows, count } = await db.Patient.findAndCountAll({
            where: whereClause,
            offset,
            limit: parseInt(limit),
            order: [['id', 'DESC']]
        })

        res.json({
            patients: rows,
            total: count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit)
        })
    } catch (err) {
        console.error('Error en getFilteredPatients:', err)
        res.status(500).json({ message: 'No se pudo obtener pacientes filtrados', error: err })
    }
}

exports.getPatientById = async (req, res) => {
    const { id } = req.params
    try {
        const patient = await db.Patient.findByPk(id, {
            include: [
                { association: 'Medic' }
            ]
        })
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' })
        }
        res.json(patient)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el paciente', error: err })
    }
}

exports.getPatientByDni = async (req, res) => {
    const { dni } = req.params
    try {
        const patient = await db.Patient.findOne({
            where: { dni: dni },
            include: [{ association: 'Medic' }]
        })
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' })
        }
        res.json(patient)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el paciente', error: err })
    }
}

exports.createPatient = async (req, res) => {
    const { dni, first_name, last_name, medic_id, health_insurance, health_insurance_id, phone1, phone2, email, notes } = req.body

    const audit = {
        user_id: req.user.userId,
        action: '[POST] CREATE_PATIENT',
        affected_entity: 'patient'
    }

    try {
        const [patient, created] = await db.Patient.findOrCreate({
            where: { dni },
            defaults: {
                first_name,
                last_name,
                medic_id,
                health_insurance,
                health_insurance_id,
                phone1,
                phone2,
                email,
                notes
            }
        })

        audit.record_id = patient.id

        if (created) {
            await logAudit(audit)
            return res.status(201).json({ message: "Patient created", patient_id: patient.id })
        } else {
            await patient.update({
                first_name,
                last_name,
                medic_id,
                health_insurance,
                health_insurance_id,
                phone1,
                phone2,
                email,
                notes
            })
            await logAudit({ ...audit, action: '[PUT] UPDATE_PATIENT' })
            return res.status(200).json({ message: "Patient already exists", patient_id: patient.id })
        }
    } catch (err) {
        audit.error = err.message
        console.error(err)
        await logAudit(audit)
        return res.status(500).json({ message: "Error creating patient", error: err })
    }
}


exports.updatePatient = async (req, res) => {
    const { id } = req.params
    const { dni, first_name, last_name, medic_id, health_insurance_id, phone1, phone2, email, notes } = req.body
    try {
        const patient = await db.Patient.findByPk(id)
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' })
        }

        await patient.update({ dni, first_name, last_name, medic_id, health_insurance_id, phone1, phone2, email, notes })

        res.json({ message: 'Paciente actualizado' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al actualizar paciente', error: err })
    }
}
