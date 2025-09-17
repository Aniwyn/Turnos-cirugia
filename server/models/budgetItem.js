function budgetItem(sequelize, DataTypes) {
    const BudgetItem = sequelize.define('BudgetItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        budget_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        practice_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        practice_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        eye: {
            type: DataTypes.ENUM('OD', 'OI', 'AO'),
            allowNull: false
        },
        quantity: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        },
        iva: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        module: {
            type: DataTypes.STRING(20),
            allowNull: true
        }
    }, {
        tableName: 'budget_item',
        timestamps: false,
        underscored: true
    })

    BudgetItem.associate = (models) => {
        BudgetItem.belongsTo(models.Budget, {
            foreignKey: 'budget_id',
            as: 'budget'
        })
        
        BudgetItem.belongsTo(models.Practice, {
            foreignKey: 'practice_id',
            as: 'practice'
        })
    }

    return BudgetItem
}

module.exports = budgetItem