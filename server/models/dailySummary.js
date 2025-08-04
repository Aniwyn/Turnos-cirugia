function dailySummary(sequelize, DataTypes) {
    const DailySummary = sequelize.define('DailySummary', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING
        },
        total_ars: {
            type: DataTypes.FLOAT
        },
        total_usd: {
            type: DataTypes.FLOAT
        },
        closed_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'daily_summary',
        timestamps: false
    })

    DailySummary.associate = (models) => {
        DailySummary.hasMany(models.CashBox, {
            foreignKey: 'daily_summary_id',
            as: 'cashBox'
        })
    }

    return DailySummary
}

module.exports = dailySummary