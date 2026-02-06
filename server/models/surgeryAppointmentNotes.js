function surgeryAppointmentNotes(sequelize, DataTypes) {
    const SurgeryAppointmentNotes = sequelize.define('SurgeryAppointmentNotes', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        surgery_appointment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'surgery_appointment_notes',
        timestamps: false
    })

    SurgeryAppointmentNotes.associate = (models) => {
        SurgeryAppointmentNotes.belongsTo(models.SurgeryAppointment, {
            foreignKey: 'surgery_appointment_id'
        })

        SurgeryAppointmentNotes.belongsTo(models.User, {
            foreignKey: 'user_id'
        })
    }

    return SurgeryAppointmentNotes
}

module.exports = surgeryAppointmentNotes