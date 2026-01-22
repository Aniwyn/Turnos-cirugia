const db = require('../models')

exports.getAllStudies = async (req, res) => {
    try {
        const studies = await db.Study.findAll({
            where: {
                is_active: true
            },
            // order: [['name', 'ASC']]
        })

        res.json(studies)
    } catch (error) {
        console.error('Error getAllStudies:', error)
        res.status(500).json({ message: 'Error al obtener estudios' })
    }
}