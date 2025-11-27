function accountingLedger(sequelize, DataTypes) {
    const AccountingLedger = sequelize.define('AccountingLedger', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        main_box_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        amount_ars: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0
        },
        amount_usd: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0
        },
        balance_ars_after: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0
        },
        balance_usd_after: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0
        }
    }, {
        tableName: 'accounting_ledger',
        timestamps: false
    })

    AccountingLedger.associate = models => {
        AccountingLedger.belongsTo(models.MainBox, {
            foreignKey: 'main_box_id',
            as: 'associatedMainBox'
        })
    }

    return AccountingLedger
}

module.exports = accountingLedger