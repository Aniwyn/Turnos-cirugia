function user(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role_group: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'user',
        timestamps: false
    });

    User.associate = (models) => {
        User.hasMany(models.Appointment, {
            foreignKey: 'admin_user_id'
        })

        User.hasMany(models.Appointment, {
            foreignKey: 'medical_user_id'
        })

        User.hasMany(models.CashBox, {
            foreignKey: 'user_id'
        })

        User.hasMany(models.CashMovement, {
            foreignKey: 'user_id'
        })
    }

    return User;
}

module.exports = user;