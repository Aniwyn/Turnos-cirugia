import { create } from 'zustand'
import { getAllCashMovements, getUserCashMovements } from '../services/cashMovementService'

const useCashMovementStore = create((set, get) => ({
    movements: [],
    isLoading: false,
    error: null,

    fetchCashMovements: async () => {
        set({ isLoading: true, error: null })

        try {
            const data = await getAllCashMovements()
            set({ movements: data, isLoading: false })
        } catch (error) {
            console.error('Error al cargar movimientos de caja:', error)
            set({ isLoading: false, error: 'No se pudieron cargar los movimientos de caja' })
        }
    },

    fetchMyActiveCashMovements: async () => {
        set({ isLoading: true, error: null })

        try {
            const data = await getUserCashMovements()
            set({ movements: data, isLoading: false })
        } catch (error) {
            console.error('Error al cargar movimientos de caja de usuario: ', error)
            set({ isLoading: false, error: 'No se pudieron cargar los movimientos de caja' })
        }
    },

    getCashMovementById: (id) => {
        const movement = get().movements.find((l) => l.id === id)
        return movement || null
    }
}))

export default useCashMovementStore