function medicalStatus(sequelize, DataTypes) {
    const MedicalStatus = sequelize.define('MedicalStatus', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'medical_status',
        timestamps: false
    });

    MedicalStatus.associate = (models) => {
        MedicalStatus.hasMany(models.Appointment,{
            foreignKey: 'medical_status_id'
        });
    };

    return MedicalStatus;
}

module.exports = medicalStatus;