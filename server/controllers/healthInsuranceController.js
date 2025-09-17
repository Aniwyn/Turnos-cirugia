const db = require('../models')

exports.getAllHealthInsurances = async (req, res) => {
    try {
        const healthInsurances = await db.HealthInsurance.findAll({
            attributes: {
                exclude: ['created_at', 'updated_at']
            }
        })
        res.status(200).json(healthInsurances)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error al obtener obras sociales', error: err })
    }
}