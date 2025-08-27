function cashMovementLabel(sequelize, DataTypes) {
    const CashMovementLabel = sequelize.define('CashMovementLabel', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'cash_movement_label',
        timestamps: false
    })

    CashMovementLabel.associate = (models) => {
        CashMovementLabel.hasMany(models.CashMovement, {
            foreignKey: 'label_id'
        })
    }

    return CashMovementLabel
}

module.exports = cashMovementLabel