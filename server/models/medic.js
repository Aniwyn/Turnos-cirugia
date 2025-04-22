function medic(sequelize, DataTypes) {
    const Medic = sequelize.define('Medic', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'medic',
        timestamps: false
    })

    Medic.associate = (models) => {
        Medic.hasMany(models.Appointment, { 
            foreignKey: 'surgeon_id'
        })

        Medic.hasMany(models.Patient, { 
            foreignKey: 'medic_id'
        })
    }

    return Medic
}

module.exports = medic