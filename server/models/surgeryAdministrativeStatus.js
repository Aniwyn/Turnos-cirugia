function surgeryAdministrativeStatus(sequelize, DataTypes) {
    const SurgeryAdministrativeStatus = sequelize.define('SurgeryAdministrativeStatus', {
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
        tableName: 'surgery_administrative_status',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    SurgeryAdministrativeStatus.associate = (models) => {
        SurgeryAdministrativeStatus.hasMany(models.SurgeryAppointment, {
            foreignKey: 'administrative_status_id'
        })
    }

    return SurgeryAdministrativeStatus
}

module.exports = surgeryAdministrativeStatus