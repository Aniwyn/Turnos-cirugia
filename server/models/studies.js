module.exports = (sequelize, DataTypes) => {
    const Study = sequelize.define('Study', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'studies',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    })

    Study.associate = (models) => {
        Study.hasMany(models.StudyOrderItem, {
            foreignKey: 'study_id',
            as: 'studyOrderItems'
        })
    }

    return Study
}