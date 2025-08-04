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
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        closed_at: {
            type: DataTypes.DATE
        },
        state: {
            type: DataTypes.STRING
        },
        daily_summary_id: {
            type: DataTypes.INTEGER
        },
    }, {
        tableName: 'cash_box',
        timestamps: false
    })

    CashBox.associate = (models) => {
        CashBox.hasMany(models.CashMovement, {
            foreignKey: 'cash_box_id',
            as: 'cashMovement',
        })

        CashBox.belongsTo(models.DailySummary, {
            foreignKey: 'daily_summary_id'
        })
    }

    return CashBox
}

module.exports = cashBox