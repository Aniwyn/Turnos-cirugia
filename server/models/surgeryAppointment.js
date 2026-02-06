function surgeryAppointment(sequelize, DataTypes) {
    const SurgeryAppointment = sequelize.define('SurgeryAppointment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        patient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'patients',
                key: 'id'
            }
        },
        surgery_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        surgery_time: {
            type: DataTypes.TIME,
            allowNull: true
        },
        surgeon_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        admin_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'surgery_administrative_status',
                key: 'id'
            }
        },
        clinical_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'surgery_clinical_status',
                key: 'id'
            }
        },
        created_by_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        status_code: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'CREATED'
        }
    }, {
        tableName: 'surgery_appointment',
        timestamps: false
    })

    SurgeryAppointment.associate = (models) => {
        SurgeryAppointment.belongsTo(models.Patient, {
            foreignKey: 'patient_id'
        })
    
        SurgeryAppointment.belongsToMany(models.Surgery, {
            through: 'surgery_procedures',
            foreignKey: 'surgery_appointment_id',
            otherKey: 'surgery_id',
            as: 'Surgeries',
            timestamps: false
        })

        SurgeryAppointment.hasMany(models.SurgeryProcedures, {
            foreignKey: 'surgery_appointment_id',
            as: 'SurgeryProcedures'
        })

        SurgeryAppointment.belongsTo(models.SurgeryAdministrativeStatus, {
            foreignKey: 'admin_status_id'
        })

        SurgeryAppointment.belongsTo(models.SurgeryClinicalStatus, {
            foreignKey: 'clinical_status_id'
        })

        SurgeryAppointment.belongsTo(models.Medic, {
            foreignKey: 'surgeon_id'
        })

        SurgeryAppointment.belongsTo(models.User, {
            foreignKey: 'created_by_user_id',
            as: 'CreatedByUser'
        })
    }

    return SurgeryAppointment
}

module.exports = surgeryAppointment