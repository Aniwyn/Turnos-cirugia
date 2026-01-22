module.exports = (sequelize, DataTypes) => {
    const StudyOrderItemFile = sequelize.define('StudyOrderItemFile', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        study_order_item_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        file_path: {
            type: DataTypes.STRING(512),
            allowNull: false
        },
        original_filename: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        mime_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        file_size_bytes: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true
        }
    }, {
        tableName: 'study_order_item_files',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    })

    StudyOrderItemFile.associate = (models) => {
        StudyOrderItemFile.belongsTo(models.StudyOrderItem, {
            foreignKey: 'study_order_item_id',
            as: 'studyOrderItem'
        })
    }

    return StudyOrderItemFile
}
