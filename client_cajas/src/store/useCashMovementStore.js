import { create } from 'zustand'
import { getAllCashMovements, getUserCashMovements } from '../services/cashMovementService'

const useCashMovementStore = create((set, get) => ({
    movements: [],
    isLoadingCashMovementStore: false,
    errorCashMovementStore: null,

    fetchCashMovements: async () => {
        set({ isLoadingCashMovementStore: true, errorCashMovementStore: null })

        try {
            const data = await getAllCashMovements()
            set({ movements: data, isLoadingCashMovementStore: false })
        } catch (error) {
            console.error('Error al cargar movimientos de caja:', error)
            set({ isLoadingCashMovementStore: false, errorCashMovementStore: 'No se pudieron cargar los movimientos de caja' })
        }
    },

    fetchMyActiveCashMovements: async (id) => {
        set({ isLoadingCashMovementStore: true, errorCashMovementStore: null })
        try {
            const data = await getUserCashMovements()
            set({ movements: data })
            return data
        } catch (error) {
            console.error('Error al cargar movimientos de caja de usuario: ', error)
            set({ errorCashMovementStore: 'No se pudieron cargar los movimientos de caja' })
        } finally {
            set({ isLoadingCashMovementStore: false})
        }
    },

    getCashMovementById: (id) => {
        const movement = get().movements.find((l) => l.id === id)
        return movement || null
    }
}))

export default useCashMovementStore