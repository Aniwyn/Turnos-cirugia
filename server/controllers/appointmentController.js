const db = require('../models')
const { createOrUpdatePatient, createAppointment, updateAppointment } = require('../services/appointmentService.js')
const logAudit = require('../services/auditLogger')

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
                ['surgery_date', 'ASC'],
                ['surgery_time', 'ASC']
            ]
        })
        res.json(appointments)
    } catch (err) {
        console.error("ERROR: ", err)
        res.status(500).json({ message: 'Error al obtener turnos', error: err })
    }
}

exports.getAllSuccessAppointments = async (req, res) => {
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
                success: 2
            }
        })
        res.json(appointments)
    } catch (err) {
        console.error("ERROR: ", err)
        res.status(500).json({ message: 'Error al obtener turnos', error: err })
    }
}

exports.getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await db.Appointment.findByPk(id, {
            include: [
                { association: 'Patient' },
                { association: 'MedicalStatus' },
                { association: 'AdministrativeStatus' },
                { association: 'Medic' },
                { association: 'AdminUser', attributes: ['name'] },
                { association: 'MedicalUser', attributes: ['name'] },
                {
                    association: 'Surgeries',
                    through: { attributes: ['id', 'intraocular_lens', 'eye'] }
                }
            ]
        })
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' })
        }
        res.json(appointment)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener turno', error: err })
    }
}

exports.createAppointment = async (req, res) => {
    const user = req.user
    const audit = {
        user_id: user.userId,
        action: '[POST] CREATE_APPOINTMENT',
        affected_entity: 'appointment'
    }

    try {
        const {
            dni,
            first_name,
            last_name,
            phone1,
            phone2,
            email,
            health_insurance,
            medic_id,
            surgery_date,
            surgery_time,
            surgeon_id,
            surgeries,
            notes,
            incidents,
            status_id
        } = req.body

        let admin_notes, nurse_notes
        let admin_incidents, nurse_incidents
        let admin_status_id, medical_status_id
        let admin_user_id, medical_user_id

        if (user.role == "admin" || user.role == "Administracion") {
            admin_notes = notes
            admin_incidents = incidents
            admin_status_id = status_id
            admin_user_id = user.userId
            medical_status_id = 0
        } else if (user.role == "nurse" || user.role == "Enfermería") {
            nurse_notes = notes
            nurse_incidents = incidents
            medical_status_id = status_id
            medical_user_id = user.userId
            admin_status_id = 0
        }

        const { patient, created, changes } = await createOrUpdatePatient({
            dni,
            first_name,
            last_name,
            medic_id,
            phone1,
            phone2,
            email,
            health_insurance
        })

        if (!created && changes && Object.keys(changes).length > 0) {
            const auditUser = {
                user_id: user.userId,
                action: '[PUT] UPDATE_PATIENT (FROM APPOINTMENT)',
                affected_entity: 'patient',
                record_id: patient.id,
                data: JSON.stringify({ patient_changes: changes })
            }

            await logAudit(auditUser)
        }

        const appointment = await createAppointment({
            patient_id: patient.id,
            admin_notes,
            admin_incidents,
            nurse_notes,
            nurse_incidents,
            surgery_date,
            surgery_time,
            surgeon_id,
            admin_status_id,
            medical_status_id,
            admin_user_id,
            medical_user_id,
            surgeries
        })

        audit.record_id = appointment.id
        await logAudit(audit)

        res.status(201).json({
            message: created ? 'Paciente y turno creados' : 'Turno creado a paciente existente',
            appointmentId: appointment.id
        })
    } catch (err) {
        audit.error = err.message
        await logAudit(audit)
        console.error('ERROR:', err)
        res.status(500).json({ message: 'Error al crear el turno', error: err })
    }
}

exports.updateAppointment = async (req, res) => {
    const user = req.user
    const { id } = req.params

    const auditAppointment = {
        user_id: user.userId,
        action: '[PUT] UPDATE_APPOINTMENT',
        affected_entity: 'appointment',
        record_id: id
    }

    try {
        const {
            dni,
            first_name,
            last_name,
            phone1,
            phone2,
            email,
            health_insurance,
            medic_id,
            surgery_date,
            surgery_time,
            surgeon_id,
            surgeries,
            notes,
            incidents,
            status_id
        } = req.body

        const { patient, created, changes } = await createOrUpdatePatient({
            dni,
            first_name,
            last_name,
            medic_id,
            phone1,
            phone2,
            email,
            health_insurance
        })

        if (!created && changes && Object.keys(changes).length > 0) {
            const auditPatient = {
                user_id: user.userId,
                action: '[PUT] UPDATE_PATIENT (FROM APPOINTMENT)',
                affected_entity: 'patient',
                record_id: patient.id,
                data: JSON.stringify({ patient_changes: changes })
            }

            await logAudit(auditPatient)
        }

        let updateData = {
            surgery_date,
            surgery_time,
            surgeon_id
        }

        const appointmentFetch = await db.Appointment.findByPk(id)
        console.log("FETCH", appointmentFetch)

        if (user.role === "admin" || user.role === "Administracion") {
            updateData.admin_notes = notes
            updateData.admin_incidents = incidents
            updateData.admin_status_id = status_id
            if (!appointmentFetch.admin_user_id) updateData.admin_user_id = user.userId
        } else if (user.role === "nurse" || user.role === "Enfermería") {
            updateData.nurse_notes = notes
            updateData.nurse_incidents = incidents
            updateData.medical_status_id = status_id
            if (!appointmentFetch.medical_user_id) updateData.medical_user_id = user.userId
        }

        const { appointment, changesAppointment } = await updateAppointment(id, updateData, surgeries)

        if (!appointment) {
            return res.status(404).json({ message: "Turno no encontrado" })
        }

        if (changesAppointment && Object.keys(changesAppointment).length > 0) {
            auditAppointment.data = JSON.stringify({ appointment_changes: changesAppointment })
            await logAudit(auditAppointment)
        }

        res.json({ message: "Turno actualizado" })
    } catch (err) {
        console.error('ERROR:', err)
        auditAppointment.error = err.message
        await logAudit(auditAppointment)
        res.status(500).json({ message: 'Error al actualizar el turno', error: err })
    }
}

exports.successAppointment = async (req, res) => {
    const user = req.user
    const { id } = req.params
    const audit = {
        user_id: user.userId,
        action: '[PUT] SUCCESS_APPOINTMENT',
        affected_entity: 'appointment',
        record_id: id
    }


    try {
        if (user.role !== "nurse") {
            return res.status(401).json({ message: 'Usuario no autorizado' })
        }

        const appointment = await db.Appointment.findByPk(id)
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' })
        }

        await appointment.update({ success: 2 })
        await logAudit(audit)
        res.json({ message: 'Turno finalizado' })
    } catch (err) {
        audit.error = err.message
        await logAudit(audit)
        res.status(500).json({ message: 'Error al intentar marcar como realizado el turno', error: err })
    }
}

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params
    const audit = {
        user_id: req.user.userId,
        action: '[DELETE] DELETE_APPOINTMENT',
        affected_entity: 'appointment',
        record_id: id
    }

    try {
        const appointment = await db.Appointment.findByPk(id)
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' })
        }

        await appointment.update({ state: 0 })
        await logAudit(audit)

        res.json({ message: 'Turno eliminado' })
    } catch (err) {
        audit.error = err.message
        await logAudit(audit)
        res.status(500).json({ message: 'Error al eliminar turno', error: err })
    }
}