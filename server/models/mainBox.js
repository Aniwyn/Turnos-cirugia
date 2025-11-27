function mainBox(sequelize, DataTypes) {
    const MainBox = sequelize.define('MainBox', {
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
        state: {
            type: DataTypes.STRING
        },
        total_ars: {
            type: DataTypes.FLOAT
        },
        total_usd: {
            type: DataTypes.FLOAT
        },
        created_at: {
            type: DataTypes.DATE
        },
        closed_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'main_box',
        timestamps: false
    })

    MainBox.associate = (models) => {
        MainBox.hasMany(models.CashBox, {
            foreignKey: 'main_box_id',
            as: 'cashBox'
        })

        MainBox.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: "user"
        })

        MainBox.hasMany(models.AccountingLedger, {
            foreignKey: 'main_box_id'
        })
    }

    return MainBox
}

module.exports = mainBox