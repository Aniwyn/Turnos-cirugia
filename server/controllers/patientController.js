const db = require('../models')
const logAudit = require('../services/auditLogger')

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await db.Patient.findAll({
            include: [
                { association: 'Medic' }
            ],
            order: [['id', 'DESC']],
            limit: 50
        })

        res.status(200).json(patients)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener pacientes', error: err })
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
        console.log(err)
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
        console.log(err)
        res.status(500).json({ message: 'Error al actualizar paciente', error: err })
    }
}
