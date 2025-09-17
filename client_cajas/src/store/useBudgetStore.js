import { create } from 'zustand'
import { getAllBudgets, createBudget } from '../services/budgetService'

const useBudgetStore = create((set, get) => ({
    budgets: [],
    isLoadingBudgetStore: false,
    errorBudgetStore: null,

    fetchBudgets: async () => {
        set({ isLoadingBudgetStore: true, errorBudgetStore: null })
        try {
            const data = await getAllBudgets()
            set({ budgets: data, isLoadingBudgetStore: false })
        } catch (error) {
            console.error('Error al cargar presupuestos:', error)
            set({ isLoadingBudgetStore: false, errorBudgetStore: 'No se pudieron cargar los presupuestos' })
        }
    },

    createBudget: async (budget) => {
        set({ isLoadingBudgetStore: true, errorBudgetStore: null })
        try {
            const created = await createBudget(budget)
            set((state) => ({
                budgets: [...state.budgets, created],
                isLoadingBudgetStore: false
            }))
            return created
        } catch (error) {
            console.error('Error al crear presupuesto:', error)
            set({ isLoadingBudgetStore: false, errorBudgetStore: 'No se pudo crear el presupuesto' })
        }
    }
}))

export default useBudgetStore