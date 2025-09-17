const db = require('../models')

exports.getAllPractices = async (req, res) => {
    try {
        const practices = await db.Practice.findAll()
        res.status(200).json(practices)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error al obtener practicas', error: err })
    }
}

exports.createPractice = async (req, res) => {
    try {
        const { name, code, module, type, default_price } = req.body
        const practice = await db.Practice.create({ name, code, module, type, default_price })
        res.status(201).json(practice)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error al obtener practicas', error: err })
    }
}

exports.updatePractice = async (req, res) => {
    try {
        const { id } = req.params
        const { name, code, module, type, default_price } = req.body

        const practice = await db.Practice.findByPk(id)
        if (!practice) {
            return res.status(404).json({ message: 'Práctica no encontrada' })
        }

        await practice.update({ name, code, module, type, default_price })
        res.status(200).json(practice)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error al actualizar práctica', error: err })
    }
}

exports.updatePractices = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const practices = req.body

        for (const item of practices) {
            await db.Practice.update(
                {
                    name: item.name,
                    code: item.code,
                    module: item.module,
                    type: item.type,
                    default_price: item.default_price
                },
                { where: { id: item.id }, transaction: t }
            )
        }
        await t.commit()

        const data = await db.Practice.findAll()
        res.status(200).json({ message: 'Prácticas actualizadas correctamente', data: data })
    } catch (err) {
        await t.rollback()
        console.log(err)
        res.status(500).json({ message: 'Error al actualizar prácticas', error: err })
    }
}


//Eliminar
//exports.deletePractice = async (req, res) => {
//    try {
//        const { id } = req.params
//
//        const practice = await db.Practice.findByPk(id)
//        if (!practice) {
//            return res.status(404).json({ message: 'Práctica no encontrada' })
//        }
//
//        await practice.destroy()
//        res.status(200).json({ message: 'Práctica eliminada correctamente' })
//    } catch (err) {
//        console.log(err)
//        res.status(500).json({ message: 'Error al eliminar práctica', error: err })
//    }
//}