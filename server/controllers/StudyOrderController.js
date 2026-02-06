const { Op } = require('sequelize')
const db = require('../models')

exports.getLastStudyOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5
        const orders = await db.StudyOrder.findAll({
            limit: limit,
            include: [
                { association: 'user', attributes: ['id', 'name'] },
                { association: 'status' },
                { association: 'healthInsurance' },
                { association: 'medic' },
                {
                    association: 'items',
                    include: [
                        { association: 'study' },
                        { association: 'status' }
                    ]
                }
            ],
            order: [['created_at', 'DESC']]
        })
        res.json(orders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener los últimos órdenes de estudio', error: err })
    }
}

exports.getPendingOverdueStudyOrders = async (req, res) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const orders = await db.StudyOrder.findAll({
            where: {
                created_at: { [Op.lt]: today }
            },
            include: [
                { 
                    association: 'status',
                    where: {
                        code: { [Op.notIn]: ['COMPLETED', 'CANCELED'] }
                    }
                },
                { association: 'user', attributes: ['id', 'name'] },
                { association: 'healthInsurance' },
                { association: 'medic' },
                {
                    association: 'items',
                    include: [
                        { association: 'study' },
                        { association: 'status' }
                    ]
                }
            ],
            order: [['created_at', 'ASC']]
        })

        res.json(orders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener estudios pendientes atrasados', error: err })
    }
}

exports.getFilteredStudyOrders = async (req, res) => {
    try {
        const { lastName, firstName, dni, idAbacus, id, date } = req.query
        const whereClause = {}

        if (lastName) whereClause.last_name = { [Op.like]: `%${lastName}%` }
        if (firstName) whereClause.first_name = { [Op.like]: `%${firstName}%` }
        if (dni) whereClause.dni = { [Op.like]: `%${dni}%` }
        if (idAbacus) whereClause.abacus_patient_id = idAbacus
        if (id) whereClause.id = id
        if (date) {
            const startOfDay = new Date(`${date}T00:00:00`)
            const endOfDay = new Date(`${date}T23:59:59.999`)
            whereClause.created_at = { [Op.between]: [startOfDay, endOfDay] }
        }

        // IMPORTANTE: Limitamos los resultados para evitar saturar el cliente en búsquedas amplias
        const orders = await db.StudyOrder.findAll({
            where: whereClause,
            include: [
                { association: 'user', attributes: ['id', 'name'] },
                { association: 'status' },
                { association: 'healthInsurance' },
                { association: 'medic' },
                {
                    association: 'items',
                    include: [
                        { association: 'study' },
                        { association: 'status' }
                    ]
                }
            ],
            order: [['created_at', 'DESC']],
            limit: 50
        })
        res.json(orders)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al filtrar órdenes de estudio', error: err })
    }
}

exports.getStudyOrderById = async (req, res) => {
    try {
        const { id } = req.params
        const order = await db.StudyOrder.findByPk(id, {
            include: [
                { association: 'user', attributes: ['id', 'name'] },
                { association: 'status' },
                { association: 'healthInsurance' },
                { association: 'medic' },
                {
                    association: 'items',
                    include: [
                        { association: 'study' },
                        { association: 'status' }
                    ]
                }
            ]
        })

        if (!order) {
            return res.status(404).json({ message: 'Orden de estudio no encontrada' })
        }

        res.json(order)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener la orden de estudio', error: err })
    }
}

exports.createStudyOrder = async (req, res) => {
    const t = await db.sequelize.transaction()
    
    try {
        const { idAbacus, dni, lastName, firstName, formattedBirthDate, email, healthInsuranceId, medicId, notes, studiesRequested } = req.body
        const userId = req.user.userId


        // Quiero incorporar los pacientes de abacus a nuestra bd?
        
        // let patient = await db.Patient.findOne({ where: { dni }, transaction: t })

        // const patientData = {
        //     first_name: firstName,
        //     last_name: lastName,
        //     email,
        //     birth_date: formattedBirthDate,
        //     health_insurance_id: healthInsuranceId,
        //     abacus_id: idAbacus
        // }

        // if (patient) {
        //     await patient.update(patientData, { transaction: t })
        // } else {
        //     patient = await db.Patient.create({
        //         dni,
        //         ...patientData
        //     }, { transaction: t })
        // }

        const order = await db.StudyOrder.create({
            abacus_patient_id: idAbacus,
            dni: dni,
            first_name: firstName,
            last_name: lastName,
            email: email,
            birth_date: formattedBirthDate,
            medic_id: medicId,
            health_insurance_id: healthInsuranceId,
            notes: notes,
            status_id: 1,
            user_id: userId
        }, { transaction: t })

        if (studiesRequested && studiesRequested.length > 0) {
            const items = studiesRequested.map(study => ({
                study_order_id: order.id,
                study_id: study.id,
                status_id: 1,
                eye: study.eye
            }))
            await db.StudyOrderItem.bulkCreate(items, { transaction: t })
        }

        await t.commit()
        res.status(201).json({ message: 'Pedido de estudio creado', order })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al crear pedido de estudio', error: err })
    }
}

exports.takeStudyOrder = async (req, res) => {
    const t = await db.sequelize.transaction()

    try {
        const { id } = req.params

        const order = await db.StudyOrder.findByPk(id, { transaction: t, include: [{ association: 'status' }] })

        if (!order) {
            await t.rollback()
            return res.status(404).json({ message: 'Orden de estudio no encontrada' })
        }

        if (order.status.code != "SUBMITTED") {
            await t.rollback()
            return res.status(400).json({ message: 'Orden en estado incorrecto' })
        }

        const inProgressStatus = await db.StudyOrderStatus.findOne({ 
            where: { code: 'IN_PROGRESS' },
            transaction: t 
        })

        if (!inProgressStatus) {
            await t.rollback()
            return res.status(500).json({ message: 'Estado IN_PROGRESS no configurado en la base de datos' })
        }

        await order.update({ status_id: inProgressStatus.id }, { transaction: t })

        await t.commit()

        const updatedOrder = await db.StudyOrder.findByPk(id, {
            include: [
                { association: 'user', attributes: ['id', 'name'] },
                { association: 'status' },
                { association: 'healthInsurance' },
                { association: 'medic' },
                { association: 'items', include: [{ association: 'study' }, { association: 'status' }] }
            ]
        })

        res.status(200).json(updatedOrder)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al tomar la orden de estudio', error: err })
    }
}

exports.cancelStudyOrder = async (req, res) => {
    const t = await db.sequelize.transaction()

    try {
        const { id } = req.params
        const role = req.user.role

        if (!['superadmin', 'secretary'].includes(role)) {
            await t.rollback()
            return res.status(403).json({ message: 'No tiene permisos para anular este pedido.' })
        }

        const order = await db.StudyOrder.findByPk(id, { 
            transaction: t,
            include: [{ association: 'status' }] 
        })

        if (!order) {
            await t.rollback()
            return res.status(404).json({ message: 'Orden de estudio no encontrada.' })
        }

        if (order.status.code !== 'SUBMITTED') {
            await t.rollback()
            return res.status(400).json({ message: 'Solo se pueden anular pedidos en estado "Enviado" (SUBMITTED).' })
        }

        const cancelledStatus = await db.StudyOrderStatus.findOne({ 
            where: { code: 'CANCELED' },
            transaction: t 
        })

        if (!cancelledStatus) {
            await t.rollback()
            return res.status(500).json({ message: 'Estado CANCELLED no configurado en el sistema.' })
        }

        await order.update({ status_id: cancelledStatus.id }, { transaction: t })

        await t.commit()

        const updatedOrder = await db.StudyOrder.findByPk(id, {
            include: [
                { association: 'user', attributes: ['id', 'name'] },
                { association: 'status' },
                { association: 'healthInsurance' },
                { association: 'medic' },
                { association: 'items', include: [{ association: 'study' }, { association: 'status' }] }
            ]
        })

        res.status(200).json(updatedOrder)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al anular la orden de estudio', error: err })
    }
}
