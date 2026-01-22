module.exports = (sequelize, DataTypes) => {
    const StudyOrderStatus = sequelize.define('StudyOrderStatus', {
        id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(32),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        is_final: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: false
        },
        tailwind_color: {
            type: DataTypes.STRING(14)
        }
    }, {
        tableName: 'study_order_statuses',
        timestamps: false,
        underscored: true
    })

    StudyOrderStatus.associate = (models) => {
        StudyOrderStatus.hasMany(models.StudyOrder, {
            foreignKey: 'status_id',
            as: 'studyOrders'
        })
    }

    return StudyOrderStatus
}