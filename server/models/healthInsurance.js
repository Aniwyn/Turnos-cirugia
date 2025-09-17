function healthInsurance(sequelize, DataTypes) {
    const HealthInsurance = sequelize.define('HealthInsurance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        }
    }, {
        tableName: 'health_insurance',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })


    return HealthInsurance
}

module.exports = healthInsurance