const db = require('../models')


exports.getStampByUserId = async (req, res) => {
    const { id } = req.params

    try {
        const stamp = await db.Stamp.findOne({ where: { user_id: id } })

        if (!stamp) {
            return res.status(404).json({ message: 'Sello no encontrado' })
        }

        res.status(200).json(stamp)
    } catch (err) {
        console.error('Error en getStampByUserId:', err)
        res.status(500).json({ message: 'Error al obtener el sello', error: err })
    }
}

exports.getStampImageByName = async (req, res) => {
    return
    // const { img_name } = req.params

    // const fileName = STAMPS[stampName]
    // if (!fileName) {
    //     return res.status(404).json({ message: 'Stamp not found' })
    // }

    // const filePath = path.join(STAMPS_DIR, fileName)
}

exports.getStampByStampKey = async (req, res) => {
    const { stamp_key } = req.body
    return
    try {
        const stamp = await db.Stamp.findOne(id, {})
        if (!stamp) {
            return res.status(404).json({ message: 'Cirugía no encontrada' })
        }
        res.json(surgery)
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener cirugias', error: err })
    }
}