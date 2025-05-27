function appointment(sequelize, DataTypes) {
    const Appointment = sequelize.define('Appointment', {
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
        admin_notes: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nurse_notes: {
            type: DataTypes.STRING,
            allowNull: true
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
                model: 'administrative_status',
                key: 'id'
            }
        },
        medical_status_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'medical_status',
                key: 'id'
            }
        },
        admin_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        medical_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        state: {
            type: DataTypes.INTEGER
        },
        success: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'appointment',
        timestamps: false
    });

    Appointment.associate = (models) => {
        Appointment.belongsTo(models.Patient, {
            foreignKey: 'patient_id'
        });
    
        Appointment.belongsToMany(models.Surgery, {
            through: 'appointment_surgery',
            foreignKey: 'appointment_id',
            otherKey: 'surgery_id',
            as: 'Surgeries',
            timestamps: false
        });

        Appointment.hasMany(models.AppointmentSurgery, {
            foreignKey: 'appointment_id',
            as: 'AppointmentSurgeries'
        });
    
        Appointment.belongsTo(models.AdministrativeStatus, {
            foreignKey: 'admin_status_id'
        });
      
        Appointment.belongsTo(models.MedicalStatus, {
            foreignKey: 'medical_status_id'
        });

        Appointment.belongsTo(models.Medic, {
            foreignKey: 'surgeon_id'
        });

        Appointment.belongsTo(models.User, {
            foreignKey: 'admin_user_id',
            as: 'AdminUser'
        });

        Appointment.belongsTo(models.User, {
            foreignKey: 'medical_user_id',
            as: 'MedicalUser'
        });
    };

    return Appointment;
}

module.exports = appointment;
