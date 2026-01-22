function counsul_pacientes(sequelize, DataTypes) {
    const CounsulPacientes = sequelize.define('CounsulPacientes', {
        id_paciente: {
            type: DataTypes.FLOAT,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING,
        },
        apellido: {
            type: DataTypes.STRING,
        },
        fec_nacimiento: {
            type: DataTypes.DATEONLY,
        }
    }, {
        tableName: 'consul_pacientes',
        timestamps: false
    })

    CounsulPacientes.associate = function (models) {
        CounsulPacientes.belongsTo(models.Clientes, {
            foreignKey: 'id_paciente',
            targetKey: 'id_cliente'
        })

        CounsulPacientes.hasMany(models.ConsulPacientesPrestadores, {
            foreignKey: 'id_paciente',
            sourceKey: 'id_paciente'
        })
    }

    return CounsulPacientes
}

module.exports = counsul_pacientes