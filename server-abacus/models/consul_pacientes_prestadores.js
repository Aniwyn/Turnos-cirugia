function consul_pacientes_prestadores(sequelize, DataTypes) {
    const ConsulPacientesPrestadores = sequelize.define('ConsulPacientesPrestadores', {
        id_prestadora: {
            type: DataTypes.FLOAT,
            primaryKey: true
        },
        id_paciente: {
            type: DataTypes.FLOAT,
            primaryKey: true
        },
        habitual: {
            type: DataTypes.INTEGER,
        },
    }, {
        tableName: 'consul_pacientes_prestadores',
        timestamps: false
    })

    ConsulPacientesPrestadores.associate = function (models) {
        ConsulPacientesPrestadores.belongsTo(models.CounsulPacientes, {
            foreignKey: 'id_paciente'
        })

        ConsulPacientesPrestadores.belongsTo(models.ConsulPrestadores, {
            foreignKey: 'id_prestadora'
        })
    }

    return ConsulPacientesPrestadores
}

module.exports = consul_pacientes_prestadores