const db = require('../models')

const updateParentOrderStatus = async (orderId, transaction) => {
    const order = await db.StudyOrder.findByPk(orderId, {
        include: [{ association: 'status' }],
        transaction
    })

    if (!order || order.status.code === 'CANCELED') return

    const items = await db.StudyOrderItem.findAll({
        where: { study_order_id: orderId },
        transaction
    })

    if (items.length === 0) return

    const totalItems = items.length
    const finalizedItems = items.filter(i => i.status_id !== 1).length

    let newStatusCode = 'IN_PROGRESS'

    console.log(totalItems, " AA ", finalizedItems, "\n\n")

    if (finalizedItems === totalItems) {
        newStatusCode = 'COMPLETED'
    } else if (finalizedItems > 0) {
        newStatusCode = 'PARTIALLY_COMPLETED'
    }

    if (order.status.code !== newStatusCode) {
        const newStatus = await db.StudyOrderStatus.findOne({
            where: { code: newStatusCode },
            transaction
        })

        if (newStatus) {
            await order.update({ status_id: newStatus.id }, { transaction })
        }
    }
}

exports.completeStudyOrderItem = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { id } = req.params

        const item = await db.StudyOrderItem.findByPk(id, { transaction: t })

        if (!item) {
            await t.rollback()
            return res.status(404).json({ message: 'Item no encontrado' })
        }

        if (item.status_id !== 1) {
            await t.rollback()
            return res.status(400).json({ message: 'El item debe estar en estado Pendiente (ID 1) para ser completado.' })
        }

        await item.update({ status_id: 2 }, { transaction: t })

        await updateParentOrderStatus(item.study_order_id, t)

        await t.commit()
        res.json({ message: 'Item completado exitosamente', item })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al completar el item', error: err })
    }
}

exports.rejectStudyOrderItem = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { id } = req.params
        const { justification } = req.body

        if (!justification) {
            await t.rollback()
            return res.status(400).json({ message: 'La justificación es obligatoria para marcar como no realizado.' })
        }

        const item = await db.StudyOrderItem.findByPk(id, { transaction: t })

        if (!item) {
            await t.rollback()
            return res.status(404).json({ message: 'Item no encontrado' })
        }

        if (item.status_id !== 1) {
            await t.rollback()
            return res.status(400).json({ message: 'El item debe estar en estado Pendiente (ID 1) para ser rechazado.' })
        }

        await item.update({ status_id: 3, justification: justification }, { transaction: t })

        await updateParentOrderStatus(item.study_order_id, t)

        await t.commit()
        res.json({ message: 'Item marcado como no realizado', item })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al rechazar el item', error: err })
    }
}

exports.completeAllStudyOrderItems = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { orderId } = req.params

        await db.StudyOrderItem.update(
            { status_id: 2 },
            { 
                where: { study_order_id: orderId, status_id: 1 },
                transaction: t 
            }
        )

        await updateParentOrderStatus(orderId, t)

        await t.commit()
        res.json({ message: 'Todos los items pendientes han sido completados.' })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al completar todos los items', error: err })
    }
}

exports.rejectAllStudyOrderItems = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { orderId } = req.params
        const { justification } = req.body

        if (!justification) {
            await t.rollback()
            return res.status(400).json({ message: 'La justificación es obligatoria.' })
        }

        await db.StudyOrderItem.update(
            { status_id: 3, justification: justification },
            { 
                where: { study_order_id: orderId, status_id: 1 },
                transaction: t 
            }
        )

        await updateParentOrderStatus(orderId, t)

        await t.commit()
        res.json({ message: 'Todos los items pendientes han sido marcados como no realizados.' })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al rechazar todos los items', error: err })
    }
}

exports.editStudyOrderItem = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { id } = req.params
        const { role } = req.user

        if (!['superadmin', 'researchtechnician'].includes(role)) {
            await t.rollback()
            return res.status(403).json({ message: 'No tiene permisos para editar este estudio.' })
        }

        const item = await db.StudyOrderItem.findByPk(id, {
            include: [{ association: 'status' }],
            transaction: t
        })

        if (!item) {
            await t.rollback()
            return res.status(404).json({ message: 'Item no encontrado' })
        }

        const statusCode = item.status?.code
        console.log("AAAA\n", id, statusCode)
        if (statusCode !== 'DONE' && statusCode !== 'NOT_PERFORMED') {
            await t.rollback()
            return res.status(400).json({ message: 'El estudio debe estar en estado DONE o NOT_PERFORMED para ser editado.' })
        }

        const hoursSinceUpdate = (new Date() - new Date(item.updated_at)) / (1000 * 60 * 60)
        if (hoursSinceUpdate > 25) {
            await t.rollback()
            return res.status(400).json({ message: 'El tiempo límite de edición (24hs) ha expirado.' })
        }

        // Volvemos a estado PENDING (ID 1) para reabrir el flujo y actualizar correctamente el padre
        const updateData = { status_id: 1 }

        if (statusCode === 'DONE') {
            if (db.StudyOrderItemFile) {
                await db.StudyOrderItemFile.destroy({ where: { study_order_item_id: id }, transaction: t })
            }
        } else {
            updateData.justification = null
        }

        await item.update(updateData, { transaction: t })
        await updateParentOrderStatus(item.study_order_id, t)

        await t.commit()
        res.json({ message: 'Estudio reabierto para edición.', item })
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al editar el item', error: err })
    }
}