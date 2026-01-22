module.exports = (sequelize, DataTypes) => {
    const StudyOrderItemStatus = sequelize.define('StudyOrderItemStatus', {
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
        tableName: 'study_order_item_statuses',
        timestamps: false
    })

    StudyOrderItemStatus.associate = (models) => {
        StudyOrderItemStatus.hasMany(models.StudyOrderItem, {
            foreignKey: 'status_id',
            as: 'studyOrderItems'
        })
    }

    return StudyOrderItemStatus
}