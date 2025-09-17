function budget(sequelize, DataTypes) {
    const Budget = sequelize.define('Budget', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        patient_dni: {
            type: DataTypes.STRING(9),
            allowNull: true
        },
        patient_name: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        budget_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        validity_days: {
            type: DataTypes.SMALLINT,
            allowNull: true
        },
        patient_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        recipient: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        extra_line: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        responsible_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        responsible_name: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        }
    }, {
        tableName: 'budget',
        timestamps: false,
        underscored: true
    })

    Budget.associate = (models) => {
        Budget.hasMany(models.BudgetItem, {
            foreignKey: 'budget_id',
            as: 'items'
        })
    }

    return Budget
}

module.exports = budget