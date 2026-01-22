function consul_prestadores(sequelize, DataTypes) {
    const ConsulPrestadores = sequelize.define('ConsulPrestadores', {
        id_prestadora: {
            type: DataTypes.FLOAT,
            primaryKey: true
        },
        descripcion: {
            type: DataTypes.STRING,
        },
    }, {
        tableName: 'consul_prestadores',
        timestamps: false
    })

    ConsulPrestadores.associate = function (models) {
        ConsulPrestadores.hasMany(models.ConsulPacientesPrestadores, {
            foreignKey: 'id_prestadora',
            sourceKey: 'id_prestadora'
        })
    }

    return ConsulPrestadores
}

module.exports = consul_prestadores