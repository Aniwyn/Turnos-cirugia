import { create } from 'zustand'
import { getAllCashBox, getCashBoxesPaginated, getUserCashBoxesPaginated, getMyActiveCashBox, closeCashBox, getCashBoxById, getAvailableForMainBox, linkMainBox, unlinkMainBox } from '../services/cashBoxService'
import useAuthStore from './useAuthStore'

const useCashBoxStore = create((set, get) => ({
    boxes: [],
    queryTerms: {},
    isLoadingCashBoxStore: false,
    errorCashBoxStore: null,

    setQueryTerms: (name, value) => {
        const updated = { ...get().queryTerms }

        if (value === "" || value === null) { delete updated[name] }
        else { updated[name] = value }

        set({ queryTerms: updated })
    },

    fetchBoxes: async () => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })

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
            set({ errorCashBoxStore: 'No se pudieron cargar las cajas' })
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    fetchCashBoxesPaginated: async (page = 1, limit = get().pageSize) => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })

        try {
            const { boxes, total, totalPages } = await getUserCashBoxesPaginated(get().queryTerms, page, limit)
            set({
                boxes,
                totalCashBoxes: total,
                totalPages,
                currentPage: page,
                errorCashBoxStore: false
            })
        } catch (error) {
            console.error('Error al cargar cajas paginadas:', error)
            set({ errorCashBoxStore: 'No se pudieron cargar las cajas paginadas' })
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    fetchMyActiveCashBox: async () => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })

        try {
            const data = await getMyActiveCashBox()

            if (Array.isArray(data) && data.length === 0) { set({ errorCashBoxStore: "No hay una caja activa para este usuario." }) }
            if (Array.isArray(data) && data.length >= 2) { set({ errorCashBoxStore: "ERROR: Este usuario tiene mas de una caja activa. Por favor comuniquese con personal de sistemas." }) }

            return data
        } catch (error) {
            console.error('Error al cargar caja del usuario:', error)
            set({ errorCashBoxStore: 'No se pudo cargar la caja.' })
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    fetchAvailableForMainBox: async () => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })

        try {
            const data = await getAvailableForMainBox()
            return data
        } catch (error) {
            console.error('Error al cargar caja del usuario:', error)
            set({ errorCashBoxStore: 'No se pudo cargar la caja.' })
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    closeBox: async (boxId, description) => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })

        try {
            await closeCashBox(boxId, { description })
            await get().fetchBoxes()
        } catch (error) {
            const msg = error?.response?.data?.message || "No se pudo cerrar la caja"
            set({ errorCashBoxStore: msg })
            throw new Error(msg)
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    getCashBoxById: async (id) => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })

        try {
            const data = await getCashBoxById(id)
            return data
        } catch {
            console.error('Error al cargar caja solicitada:', error)
            set({ errorCashBoxStore: 'No se pudo cargar la caja solicitada.' })
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    linkMainBoxById: async (id, mainBoxId) => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })
        try {
            const message = await linkMainBox(id, mainBoxId)
            return message
        } catch (error) {
            const msg = error?.response?.data?.message || "No se pudo vincular la caja general"
            set({ errorCashBoxStore: msg })
            throw new Error(msg)
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    },

    unlinkMainBoxById: async (id) => {
        set({ isLoadingCashBoxStore: true, errorCashBoxStore: null })
        try {
            const message = await unlinkMainBox(id)
            return message
        } catch (error) {
            const msg = error?.response?.data?.message || "No se pudo desvincular la caja general"
            set({ errorCashBoxStore: msg })
            throw new Error(msg)
        } finally {
            set({ isLoadingCashBoxStore: false })
        }
    }
}))

export default useCashBoxStore