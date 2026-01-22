import { create } from 'zustand'
import { getPaginatedBudgets, getFilteredBudgets, createBudget } from '../services/budgetService'

const useBudgetStore = create((set, get) => ({
    budgets: [],
    totalBudgets: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    queryTerms: {},
    isLoadingBudgetStore: false,
    errorBudgetStore: null,

    fetchPaginatedBudgets: async (page = 1, limit = get().pageSize) => {
        set({ isLoadingBudgetStore: true, errorBudgetStore: null })
        try {
            const { budgets, total, totalPages } = await getPaginatedBudgets(get().queryTerms, page, limit)
            set({
                budgets,
                totalBudgets: total,
                totalPages,
                currentPage: page
            })
        } catch (error) {
            console.error('Error al cargar presupuestos paginados:', error)
            set({ errorBudgetStore: 'No se pudieron cargar los presupuestos' })
        } finally {
            set({ isLoadingBudgetStore: false })
        }
    },

    fetchFilteredBudgets: async (query = {}) => {
        set({ isLoadingBudgetStore: true, errorBudgetStore: null })
        try {
            const page = 1
            const limit = get().pageSize
            const { budgets, total, totalPages } = await getFilteredBudgets(query, page, limit)
            set({
                budgets,
                totalBudgets: total,
                totalPages,
                currentPage: page,
                queryTerms: query
            })
        } catch (error) {
            console.error('Error al cargar presupuestos filtrados:', error)
            set({ errorBudgetStore: 'No se pudieron cargar los presupuestos filtrados' })
        } finally {
            set({ isLoadingBudgetStore: false })
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