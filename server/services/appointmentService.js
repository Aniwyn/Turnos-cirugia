// services/appointmentService.js
const db = require('../models')

async function createOrUpdatePatient(patientData) {
    const { dni } = patientData

    let patient = await db.Patient.findOne({ where: { dni } })

    if (!patient) {
        patient = await db.Patient.create(patientData)
        return { patient, created: true }
    }

    const changes = {}
    const fields = ['first_name', 'last_name', 'medic_id', 'phone1', 'phone2', 'email', 'health_insurance']

    fields.forEach(field => {
        if (patientData[field] !== undefined && patient[field] !== patientData[field]) {
            changes[field] = {
                before: patient[field],
                after: patientData[field]
            }
        }
    })

    if (Object.keys(changes).length > 0) {
        await patient.update(patientData)
    }

    return { patient, created: false, changes }
}

async function createAppointment(data) {
    const {
        patient_id,
        admin_notes,
        nurse_notes,
        surgery_date,
        surgery_time,
        surgeon_id,
        admin_status_id,
        medical_status_id,
        admin_user_id,
        medical_user_id,
        surgeries
    } = data

    const appointment = await db.Appointment.create({
        patient_id,
        admin_notes,
        nurse_notes,
        surgery_date,
        surgery_time,
        surgeon_id,
        admin_status_id,
        medical_status_id,
        admin_user_id,
        medical_user_id,
    })

    if (Array.isArray(surgeries) && surgeries.length > 0) {
        const surgeryData = surgeries.map(surgery => ({
            appointment_id: appointment.id,
            surgery_id: surgery.surgery_id,
            eye: surgery.eye,
            intraocular_lens: surgery.intraocular_lens
        }))
        await db.AppointmentSurgery.bulkCreate(surgeryData)
    }

    return appointment
}

async function updateAppointment(id, updateData, surgeries) {
    const appointment = await db.Appointment.findByPk(id)
    if (!appointment) return null

    const changesAppointment = {}
    const fields = [
        'surgery_date',
        'surgery_time',
        'surgeon_id',
        'admin_notes',
        'admin_status_id',
        'admin_user_id',
        'nurse_notes',
        'medical_status_id',
        'medical_user_id'
    ]
    
    fields.forEach(field => {
        if (updateData[field] !== undefined && appointment[field] !== updateData[field]) {
            changesAppointment[field] = {
                before: appointment[field],
                after: updateData[field]
            }
        }
    })

    if (Object.keys(changesAppointment).length > 0) {
        await appointment.update(updateData)
    }

    await db.AppointmentSurgery.destroy({ where: { appointment_id: id } })

    if (Array.isArray(surgeries) && surgeries.length > 0) {
        const surgeryData = surgeries.map(surgery => ({
            appointment_id: appointment.id,
            surgery_id: surgery.surgery_id,
            eye: surgery.eye,
            intraocular_lens: surgery.intraocular_lens
        }))
        await db.AppointmentSurgery.bulkCreate(surgeryData)
    }

    return { appointment, changesAppointment }
}


module.exports = {
    createOrUpdatePatient,
    createAppointment,
    updateAppointment
}
