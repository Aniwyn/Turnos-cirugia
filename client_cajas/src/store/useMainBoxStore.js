import { create } from 'zustand'
import { getAllMainBoxes, getMainBoxesPaginated, getMyActiveMainBox, getCashBoxesForMainBox, getMainBoxById, closeMainBoxService } from '../services/mainBoxService'
import useAuthStore from './useAuthStore'

const useMainBoxStore = create((set, get) => ({
    mainBoxes: [],
    totalMainBoxes: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    queryTerms: {},
    activeMainBox: null,
    isLoadingMainBoxStore: false,
    errorMainBoxStore: null,

    setQueryTerms: (name, value) => {
        const updated = { ...get().queryTerms }

        if (value === "" || value === null) { delete updated[name] }
        else { updated[name] = value }

        set({ queryTerms: updated })
    },

    fetchMainBoxes: async () => {
        set({ isLoadingMainBoxStore: true, errorMainBoxStore: null })

        try {
            const { user } = useAuthStore.getState()

            //                                 QUITAR LA PARTE DE ""ADMIN"" (No deberían tener permiso)
            if (user?.role !== 'accountant' && user?.role !== 'admin') {
                set({ errorMainBoxStore: "El usuario no posee permisos para esta sección" })
                return
            }
            const data = await getAllMainBoxes()

            set({ mainBoxes: data })
        } catch (error) {
            console.error('Error al cargar cajas:', error)
            set({ errorMainBoxStore: 'No se pudieron cargar las cajas' })
        } finally {
            set({ isLoadingMainBoxStore: false })
        }
    },

    fetchMainBoxesPaginated: async (page = 1, limit = get().pageSize) => {
        set({ isLoadingMainBoxStore: true, errorMainBoxStore: null })

        try {
            const { user } = useAuthStore.getState()
            
            //                                 QUITAR LA PARTE DE ""ADMIN"" (No deberían tener permiso)
            if (user?.role !== 'accountant' && user?.role !== 'admin') {
                set({ errorMainBoxStore: "El usuario no posee permisos para esta sección" })
                return
            }

            const { mainBoxes, total, totalPages } = await getMainBoxesPaginated(get().queryTerms, page, limit)
            
            set({
                mainBoxes,
                totalMainBoxes: total,
                totalPages,
                currentPage: page,
                isLoadingPatientStore: false
            })
        } catch (error) {
            console.error('Error al cargar cajas paginadas:', error)
            set({ errorMainBoxStore: 'No se pudieron cargar las cajas paginadas' })
        } finally {
            set({ isLoadingMainBoxStore: false })
        }
    },

    fetchMyActiveMainBox: async () => {
        set({ isLoadingMainBoxStore: true, errorMainBoxStore: null })

        try {
            const data = await getMyActiveMainBox()

            if (Array.isArray(data) && data.length === 0) { set({ errorMainBoxStore: "No hay una caja activa para este usuario." }) }
            if (Array.isArray(data) && data.length >= 2) { set({ errorMainBoxStore: "ERROR: Este usuario tiene mas de una caja activa. Por favor comuniquese con personal de sistemas." }) }

            set({ activeMainBox: data })
            return data
        } catch (error) {
            console.error('Error al cargar caja del usuario:', error)
            set({ errorMainBoxStore: 'No se pudo cargar la caja.' })
        } finally {
            set({ isLoadingMainBoxStore: false })
        }
    },

    fetchCashBoxesForMainBox: async (id) => {
        set({ isLoadingMainBoxStore: true, errorMainBoxStore: null })
        
        try {
            const data = await getCashBoxesForMainBox(id)
            return data
        } catch (error) {
            console.error('Error al cargar las cajas de la caja general:', error)
            set({ errorMainBoxStore: 'No se pudieron cargar las cajas de la caja general.' })
        } finally {
            set({ isLoadingMainBoxStore: false })
        }
    },

    fetchMainBoxById: async (id) => {
        set({ isLoadingMainBoxStore: true, errorMainBoxStore: null })
        
        try {
            const data = await getMainBoxById(id)
            console.log("AAAAAAAAAAAA", data)

            return data
        } catch (error) {
            console.error('Error al cargar la caja general por ID:', error)
            set({ errorMainBoxStore: 'No se pudo cargar la caja general.' })
        } finally {
            set({ isLoadingMainBoxStore: false })
        }
    },

    closeMainBox: async (id) => {
        set({ isLoadingMainBoxStore: true, errorMainBoxStore: null })

        try {
            const data = await closeMainBoxService(id)
            return data
        } catch (error) {
            console.error('Error al cerrar la caja general:', error)
            set({ errorMainBoxStore: 'No se pudo cerrar la caja general.' })
        } finally {
            set({ isLoadingMainBoxStore: false })
        }
    }
}))

export default useMainBoxStore