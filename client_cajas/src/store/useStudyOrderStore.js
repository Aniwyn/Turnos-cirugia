import { create } from 'zustand'
import { createStudyOrder, getLastStudyOrders, getFilteredStudyOrders, getStudyOrderById, takeStudyOrder, cancelStudyOrder, getPendingOverdueStudies } from '../services/studyOrderService'

const useStudyOrderStore = create((set, get) => ({
    studyOrders: [],
    lastStudyOrders: [],
    pendingStudies: [],
    currentStudyOrder: null,
    isLoadingStudyOrderStore: false,
    errorStudyOrderStore: null,

    fetchLastStudyOrders: async (limit = 10) => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const data = await getLastStudyOrders(limit)
            set({ lastStudyOrders: data })
            return data
        } catch (error) {
            console.error('Error al cargar últimos pedidos de estudio:', error)
            set({ errorStudyOrderStore: 'No se pudieron cargar los últimos pedidos' })
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },

    fetchPendingOverdueStudies: async () => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const data = await getPendingOverdueStudies()
            set({ pendingStudies: data })
            return data
        } catch (error) {
            console.error('Error al cargar estudios pendientes atrasados:', error)
            set({ errorStudyOrderStore: 'No se pudieron cargar los estudios pendientes atrasados' })
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },

    fetchFilteredStudyOrders: async (filters) => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const data = await getFilteredStudyOrders(filters)
            set({ studyOrders: data })
            return data
        } catch (error) {
            console.error('Error al filtrar pedidos de estudio:', error)
            set({ errorStudyOrderStore: 'No se pudieron filtrar los pedidos' })
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },

    fetchStudyOrderById: async (id) => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const data = await getStudyOrderById(id)
            set({ currentStudyOrder: data })
            return data
        } catch (error) {
            console.error('Error al obtener el pedido de estudio:', error)
            set({ errorStudyOrderStore: 'No se pudo obtener el pedido de estudio' })
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },

    createStudyOrder: async (newOrder) => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const response = await createStudyOrder(newOrder)
            console.log(response)
            const createdOrder = response.order
            set((state) => ({ studyOrders: [createdOrder, ...state.studyOrders] }))
            return response
        } catch (error) {
            console.error('Error al crear pedido de estudio:', error)
            set({ errorStudyOrderStore: 'No se pudo crear el pedido de estudio' })
            throw error
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },

    takeStudyOrder: async (id) => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const response = await takeStudyOrder(id)
            const updatedOrder = response

            return updatedOrder
        } catch (error) {
            console.error('Error al tomar pedido de estudio:', error)
            set({ errorStudyOrderStore: 'No se pudo tomar el pedido de estudio' })
            throw error
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },

    cancelStudyOrder: async (id) => {
        set({ isLoadingStudyOrderStore: true, errorStudyOrderStore: null })

        try {
            const response = await cancelStudyOrder(id)
            const updatedOrder = response

            return updatedOrder
        } catch (error) {
            console.error('Error al anular pedido de estudio:', error)
            set({ errorStudyOrderStore: 'No se pudo anular el pedido de estudio' })
            throw error
        } finally {
            set({ isLoadingStudyOrderStore: false })
        }
    },
}))

export default useStudyOrderStore
