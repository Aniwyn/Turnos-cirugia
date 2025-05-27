function administrativeStatus(sequelize, DataTypes) {
    const AdministrativeStatus = sequelize.define('AdministrativeStatus', {
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
        tableName: 'administrative_status',
        timestamps: false
    });

    AdministrativeStatus.associate = (models) => {
        AdministrativeStatus.hasMany(models.Appointment,{
            foreignKey: 'admin_status_id'
        });
    }

    return AdministrativeStatus
}

module.exports = administrativeStatus;