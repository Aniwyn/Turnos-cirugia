const db = require('../models')
const fs = require('fs/promises')
const path = require('path')

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
        res.status(500).json({ message: 'Error al obtener el sello' })
    }
}

exports.getMyStamp = async (req, res) => {
    try {
        const userId = req.user.userId
        const stamp = await db.Stamp.findOne({ where: { user_id: userId } })

        if (!stamp) {
            return res.status(404).json({ message: 'Sello no encontrado' })
        }

        const imageName = stamp.stamp_name
        if (!imageName) {
            return res.status(200).json(stamp)
        }

        const imagePath = path.join(__dirname, '..', 'stamps', imageName)

        try {
            const imageData = await fs.readFile(imagePath)
            const imageBase64 = Buffer.from(imageData).toString('base64')
            const mimeType = `image/${path.extname(imageName).slice(1)}`

            const stampData = stamp.toJSON()
            stampData.imageData = `data:${mimeType};base64,${imageBase64}`

            res.status(200).json(stampData)
        } catch (fileError) {
            console.error('Error reading stamp image file:', fileError)
            const stampData = stamp.toJSON()
            stampData.imageError = 'No se pudo cargar la imagen del sello.'
            res.status(200).json(stampData)
        }
    } catch (err) {
        console.error('Error en getMyStamp:', err)
        res.status(500).json({ message: 'Error al obtener el sello' })
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
