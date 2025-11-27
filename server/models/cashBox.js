function cashBox(sequelize, DataTypes) {
    const CashBox = sequelize.define('CashBox', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        origin: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        created_at: {
            type: DataTypes.DATE
        },
        closed_at: {
            type: DataTypes.DATE
        },
        state: {
            type: DataTypes.STRING
        },
        main_box_id: {
            type: DataTypes.INTEGER
        },
        total_ars: {
            type: DataTypes.FLOAT
        },
        total_usd: {
            type: DataTypes.FLOAT
        }
    }, {
        tableName: 'cash_box',
        timestamps: false
    })

    CashBox.associate = (models) => {
        CashBox.hasMany(models.CashMovement, {
            foreignKey: 'cash_box_id',
            as: 'cashMovement',
        })

        CashBox.belongsTo(models.MainBox, {
            foreignKey: 'main_box_id'
        })

        CashBox.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: "user"
        })
    }

    return CashBox
}

module.exports = cashBox