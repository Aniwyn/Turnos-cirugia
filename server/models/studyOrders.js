module.exports = (sequelize, DataTypes) => {
    const StudyOrder = sequelize.define('StudyOrder', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        abacus_patient_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        dni: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        first_name: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        last_name: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        birth_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        medic_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        health_insurance_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status_id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'study_orders',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    StudyOrder.associate = (models) => {
        StudyOrder.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        })

        StudyOrder.belongsTo(models.StudyOrderStatus, {
            foreignKey: 'status_id',
            as: 'status'
        })

        StudyOrder.hasMany(models.StudyOrderItem, {
            foreignKey: 'study_order_id',
            as: 'items'
        })

        StudyOrder.belongsTo(models.Medic, {
            foreignKey: 'medic_id',
            as: 'medic'
        })

        StudyOrder.belongsTo(models.HealthInsurance, {
            foreignKey: 'health_insurance_id',
            targetKey: 'abacus_id',
            as: 'healthInsurance'
        })
    }

    return StudyOrder
}