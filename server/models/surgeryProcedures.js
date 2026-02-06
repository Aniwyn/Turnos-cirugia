function surgeryProcedures(sequelize, DataTypes) {
    const SurgeryProcedures = sequelize.define('SurgeryProcedures', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        surgery_appointment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'surgery_appointment',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        surgery_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'surgery',
                key: 'id'
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        },
        intraocular_lens: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eye: {
            type: DataTypes.ENUM('LEFT', 'RIGHT', 'BOTH'),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'surgery_procedures',
        timestamps: false
    })

    SurgeryProcedures.associate = (models) => {
        SurgeryProcedures.belongsTo(models.SurgeryAppointment, {
            foreignKey: 'surgery_appointment_id',
            as: 'SurgeryAppointment'
        })

        SurgeryProcedures.belongsTo(models.Surgery, {
            foreignKey: 'surgery_id',
            as: 'Surgery'
        })
    }

    return SurgeryProcedures
}

module.exports = surgeryProcedures