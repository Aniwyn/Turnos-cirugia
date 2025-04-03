const db = require('../models');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await db.Appointment.findAll({
            include: [
                { association: 'Patient' },
                { association: 'MedicalStatus' },
                { association: 'AdministrativeStatus' },
                { 
                    association: 'Surgeries',
                    through: { attributes: ['id', 'intraocular_lens', 'eye'] } 
                }
            ]
        });
        res.json(appointments);
    } catch (err) {
        console.log("ERROR: ", err)
        res.status(500).json({ message: 'Error al obtener turnos', error: err });
    }
};

exports.getAppointmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await db.Appointment.findByPk(id, {
            include: [
                { association: 'Patient' },
                { association: 'MedicalStatus' },
                { association: 'AdministrativeStatus' },
            ]
        });
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener turno', error: err });
    }
};

exports.createAppointment = async (req, res) => {
    const { 
        patient_id, 
        admin_notes, 
        nurse_notes, 
        surgery_date, 
        surgery_time, 
        surgeon_id, 
        admin_status_id, 
        medical_status_id, 
        surgeries 
    } = req.body
    const asd = req.body
    console.log(asd)
    try {
        const appointment = await db.Appointment.create({
            patient_id,
            admin_notes,
            nurse_notes,
            surgery_date,
            surgery_time,
            surgeon_id,
            admin_status_id,
            medical_status_id
        });

        if(surgeries && surgeries.length > 0) {
            const surgeryData = surgeries.map(surgery => ({
                appointment_id: appointment.id,
                surgery_id: surgery.surgery_id,
                eye: surgery.eye,              
                intraocular_lens: surgery.intraocular_lens
            }))
            
            await db.AppointmentSurgery.bulkCreate(surgeryData);
        }
        res.status(201).json({ message: 'Turno creado', appointmentId: appointment.id });
    } catch (err) {
        console.log(`\n\nAAAAAArror: ${err}\n\n`)
        res.status(500).json({ message: 'Error al crear turno', error: err });
    }
};

exports.updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { patientId, adminNotes, nurseNotes, surgeryDate, surgeryTime, surgeon, adminStatusId, medicalStatusId } = req.body;
    try {
        const appointment = await db.Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        await appointment.update({
            patientId,
            adminNotes,
            nurseNotes,
            surgeryDate,
            surgeryTime,
            surgeon,
            adminStatusId,
            medicalStatusId
        });

        res.json({ message: 'Turno actualizado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar turno', error: err });
    }
};

exports.deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await db.Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        await appointment.destroy();
        res.json({ message: 'Turno eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar turno', error: err });
    }
};
