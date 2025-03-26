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
        doctor: {
            type: DataTypes.STRING,
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
        }
    }, {
        tableName: 'patient',
        timestamps: false
    });

    Patient.associate = (models) => {
        Patient.hasMany(models.Appointment, { 
            foreignKey: 'patient_id'
        });
    };

    return Patient;
}

module.exports = patient;