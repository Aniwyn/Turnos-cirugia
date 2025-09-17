function practice(sequelize, DataTypes) {
    const Practice = sequelize.define('Practice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        module: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('unilateral', 'bilateral', ''),
            allowNull: true
        },
        default_price: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false
        }
    }, {
        tableName: 'practice',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })


    return Practice
}

module.exports = practice