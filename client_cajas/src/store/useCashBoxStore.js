import { create } from 'zustand'
import { getAllCashBox, getUserCashBoxes, closeCashBox, getMyOpenCashBox } from '../services/cashBoxService'
import useAuthStore from './useAuthStore'

const useCashBoxStore = create((set, get) => ({
    boxes: [],
    openCashBox: null,
    isLoading: false,
    error: null,

    fetchBoxes: async () => {
        set({ isLoading: true, error: null })

        try {

            const { user } = useAuthStore.getState()
            let data = []

            if (user?.role === 'accountant') {
                data = await getAllCashBox()
            } else {
                data = await getUserCashBoxes()
            }
            set({ boxes: data })
        } catch (error) {
            console.error('Error al cargar cajas:', error)
            set({ error: 'No se pudieron cargar las cajas' })
        } finally {
            set({ isLoading: false })
        }
    },

    closeBox: async (boxId, description) => {
        set({ isLoading: true, error: null })

        try {
            await closeCashBox(boxId, { description })
            await get().fetchBoxes()
        } catch (error) {
            const msg = error?.response?.data?.message || "No se pudo cerrar la caja"
            set({ error: msg })
            throw new Error(msg)
        } finally {
            set({ isLoading: false })
        }
    },

    fetchOpenBox: async () => {
        set({ isLoading: true, error: null })

        try {
            const openBox = await getMyOpenCashBox()
            set({ openCashBox: openBox })
        } catch (error) {
            const msg = error?.response?.data?.message || "No se pudo cerrar la caja"
            set({ error: msg })
            throw new Error(msg)
        } finally {
            set({ isLoading: false })
        }
    },

    /*getCashBoxById: (id) => {
        const box = get().boxes.find((l) => l.id === id)
        return box || null
    }*/
}))

export default useCashBoxStore