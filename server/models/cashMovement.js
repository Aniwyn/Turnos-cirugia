function cashMovement(sequelize, DataTypes) {
    const CashMovement = sequelize.define('CashMovement', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cash_box_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING
        },
        label_id: {
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'cash_movement',
        timestamps: false
    })

    CashMovement.associate = (models) => {
        CashMovement.belongsTo(models.CashMovementLabel, {
            foreignKey: 'label_id',
            as: 'label'
        })

        CashMovement.belongsTo(models.CashBox, {
            foreignKey: 'cash_box_id'
        })
    }

    return CashMovement
}

module.exports = cashMovement