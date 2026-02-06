function surgeryClinicalStatus(sequelize, DataTypes) {
    const SurgeryClinicalStatus = sequelize.define('SurgeryClinicalStatus', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        is_satisfactory: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING(8),
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'surgery_clinical_status',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    SurgeryClinicalStatus.associate = (models) => {
        SurgeryClinicalStatus.hasMany(models.SurgeryAppointment, {
            foreignKey: 'medical_status_id'
        })
    }

    return SurgeryClinicalStatus
}

module.exports = surgeryClinicalStatus