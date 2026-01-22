const { where } = require('sequelize')
const db = require('../models')

exports.getOnePatient = async (req, res) => {
    try {
        const patient = await db.CounsulPacientes.findOne({
            include: [
                {
                    model: db.Clientes,
                    required: false
                },
                {
                    model: db.ConsulPacientesPrestadores,
                    where: { habitual: 1 },
                    required: false,
                    include: [
                        {
                            model: db.ConsulPrestadores
                        }
                    ]
                }
            ]
        })

        if (patient) {
            res.status(200).json(patient)
        } else {
            res.status(404).json({ message: 'No se encontraron pacientes en la tabla consul_pacientes.' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con la base de datos', error: error.message })
    }
}

exports.getOnePatientById = async (req, res) => {
    try {
        const id = req.params.id
        const patient = await db.CounsulPacientes.findOne({
            where: { id_paciente: id },
            include: [
                {
                    model: db.Clientes,
                    required: false
                },
                {
                    model: db.ConsulPacientesPrestadores,
                    where: { habitual: 1 },
                    required: false,
                    include: [
                        {
                            model: db.ConsulPrestadores
                        }
                    ]
                }
            ]
        })

        if (patient) {
            res.status(200).json(patient)
        } else {
            res.status(404).json({ message: 'No se encontraron pacientes en la tabla consul_pacientes.' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con la base de datos', error: error.message })
    }
}

exports.getOnePatientByDni = async (req, res) => {
    try {
        const dni = req.params.dni
        const patient = await db.CounsulPacientes.findOne({
            include: [
                {
                    model: db.Clientes,
                    where: { num_doc: dni }, 
                    required: true
                },
                {
                    model: db.ConsulPacientesPrestadores,
                    where: { habitual: 1 },
                    required: false,
                    include: [
                        {
                            model: db.ConsulPrestadores
                        }
                    ]
                }
            ]
        })

        if (patient) {
            res.status(200).json(patient)
        } else {
            res.status(404).json({ message: `No se encontró un paciente con el DNI ${dni}.` })
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al conectar con la base de datos', error: error.message })
    }
}