function patient(sequelize, DataTypes) {
    const Patient = sequelize.define('Patient', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        medic_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        phone1: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        health_insurance: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dni: {
            type: DataTypes.STRING,
            allowNull: true
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'patient',
        timestamps: false
    })

    Patient.associate = (models) => {
        Patient.hasMany(models.Appointment, { 
            foreignKey: 'patient_id'
        })

        Patient.belongsTo(models.Medic, { 
            foreignKey: 'medic_id'
        })
    }

    return Patient
}

module.exports = patient