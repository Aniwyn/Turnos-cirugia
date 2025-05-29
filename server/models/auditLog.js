function auditLog(sequelize, DataTypes) {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        action: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        affected_entity: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        record_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        error: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        tableName: 'audit_log',
        timestamps: false
    })

    AuditLog.associate = models => {
        AuditLog.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        })
    }

    return AuditLog
}

module.exports = auditLog;