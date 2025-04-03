module.exports = (sequelize, DataTypes) => {
    const AppointmentSurgery = sequelize.define('AppointmentSurgery', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        appointment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        surgery_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        intraocular_lens: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eye: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'appointment_surgery',
        timestamps: false
    })

    AppointmentSurgery.associate = (models) => {
        AppointmentSurgery.belongsTo(models.Appointment, {
            foreignKey: 'appointment_id',
            as: 'Appointment'
        })

        AppointmentSurgery.belongsTo(models.Surgery, {
            foreignKey: 'surgery_id',
            as: 'Surgery'
        })
    }

    return AppointmentSurgery
}