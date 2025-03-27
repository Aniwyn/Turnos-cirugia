const db = require('../models');

exports.getAllPatients = async (req, res) => {
    try {
        const patients = await db.Patient.findAll();

        res.status(200).json({
            meta: {
                url: req.protocol + '://' + req.get('host') + req.url,
                status: 200,
            },
            data: patients
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener pacientes', error: err });
    }
};

exports.getPatientById = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await db.Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el paciente', error: err });
    }
};

exports.getPatientByDni = async (req, res) => {
    const { dni } = req.params;
    try {
        const patient = await db.Patient.findOne({ where: { dni: dni } });
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el paciente', error: err });
    }
};

exports.createPatient = async (req, res) => {
    const { first_name, last_name, phone1, phone2, health_insurance } = req.body;
    try {
        const patient = await db.Patient.create({
            first_name,
            last_name,
            phone1,
            phone2,
            health_insurance
        });
        res.status(201).json({ message: 'Paciente creado', patientId: patient.id });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear paciente', error: err });
    }
};

exports.updatePatient = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, phone1, phone2, health_insurance } = req.body;
    try {
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        await patient.update({
            first_name,
            last_name,
            phone1,
            phone2,
            health_insurance
        });

        res.json({ message: 'Paciente actualizado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar paciente', error: err });
    }
};
