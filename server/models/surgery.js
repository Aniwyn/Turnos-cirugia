function surgery(sequelize, DataTypes) {
    const Surgery = sequelize.define('Surgery', {
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
        tableName: 'surgery',
        freezeTableName: true,
        timestamps: false
    });

    Surgery.associate = (models) => {
        Surgery.belongsToMany(models.Appointment, {
            through: 'appointment_surgery',
            foreignKey: 'surgery_id',
            otherKey: 'appointment_id'
        });
    };

    return Surgery;
}

module.exports = surgery;