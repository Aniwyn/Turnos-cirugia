function clientes(sequelize, DataTypes) {
    const Clientes = sequelize.define('Clientes', {
        id_cliente: {
            type: DataTypes.FLOAT,
            primaryKey: true
        },
        num_doc: {
            type: DataTypes.STRING,
        },
        mail: {
            type: DataTypes.TEXT,
        },
    }, {
        tableName: 'clientes',
        timestamps: false
    })

    Clientes.associate = function (models) {
        Clientes.hasOne(models.CounsulPacientes, {
            foreignKey: 'id_paciente',
            sourceKey: 'id_cliente'
        })
    }

    return Clientes
}

module.exports = clientes