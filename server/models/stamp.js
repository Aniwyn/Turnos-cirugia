function stamp(sequelize, DataTypes) {
    const Stamp = sequelize.define('Stamp', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        stamp_key: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        first_line: {
            type: DataTypes.STRING
        },
        second_line: {
            type: DataTypes.STRING
        },
        third_line: {
            type: DataTypes.STRING
        },
        fourth_line: {
            type: DataTypes.STRING
        },
        stamp_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'stamp',
        timestamps: false
    })

    return Stamp
}

module.exports = stamp