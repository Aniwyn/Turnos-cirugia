const db = require('../models')

exports.getAllBudget = async (req, res) => {
    try {
        const budgets = await db.Budget.findAll({ include: [{ association: 'items' }] })
        res.status(200).json(budgets)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener presupuestos', error: err })
    }
}

exports.getBudgetByID = async (req, res) => {
    try {
        const { id } = req.params

        const budget = await db.Budget.findByPk(id, { include: [{ association: 'items' }] })

        if (!budget) {
            return res.status(404).json({ message: 'Presupuesto no encontrado' })
        }

        res.status(200).json(budget)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error al obtener presupuesto', error: err })
    }
}

exports.createBudget = async (req, res) => {
    const t = await db.sequelize.transaction()
    try {
        const { patient_id, patient_dni, patient_name, validity_days, recipient, extra_line, total, items } = req.body
        const responsible_id = req.user.userId
        const responsible_name = req.user.name

        const budget = await db.Budget.create(
            { patient_id, patient_dni, patient_name, validity_days, recipient, extra_line, total, responsible_id, responsible_name },
            { transaction: t }
        )

        if (items && items.length > 0) {
            for (const item of items) {
                await db.BudgetItem.create(
                    {
                        budget_id: budget.id,
                        practice_id: item.practice_id,
                        practice_name: item.practice_name,
                        eye: item.eye,
                        quantity: item.quantity,
                        price: item.price,
                        iva: item.iva,
                        code: item.code,
                        module: item.module
                    },
                    { transaction: t }
                )
            }
        }

        await t.commit()

        const savedBudget = await db.Budget.findByPk(budget.id, {
            include: [{ association: 'items' }]
        })

        res.status(201).json(savedBudget)
    } catch (err) {
        await t.rollback()
        console.error(err)
        res.status(500).json({ message: 'Error al crear presupuesto', error: err })
    }
}