module.exports = (sequelize, DataTypes) => {
    const StudyOrderItem = sequelize.define('StudyOrderItem', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        study_order_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        study_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        status_id: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        observations: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        justification: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'study_order_items',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    StudyOrderItem.associate = (models) => {
        StudyOrderItem.belongsTo(models.StudyOrder, {
            foreignKey: 'study_order_id',
            as: 'studyOrder'
        })

        StudyOrderItem.belongsTo(models.StudyOrderItemStatus, {
            foreignKey: 'status_id',
            as: 'status'
        })

        StudyOrderItem.belongsTo(models.Study, {
            foreignKey: 'study_id',
            as: 'study'
        })
    }

    return StudyOrderItem
}