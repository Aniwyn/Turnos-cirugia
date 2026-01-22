import { create } from 'zustand'
import { completeStudyOrderItem, rejectStudyOrderItem, editStudyOrderItem, completeAllStudyOrderItems, rejectAllStudyOrderItems } from '../services/studyOrderItemService'

const useStudyOrderItemStore = create((set) => ({
    isLoadingStudyOrderItemStore: false,
    errorStudyOrderItemStore: null,

    completeStudyOrderItem: async (id) => {
        set({ isLoadingStudyOrderItemStore: true, errorStudyOrderItemStore: null })
        try {
            const response = await completeStudyOrderItem(id)
            return response
        } catch (error) {
            console.error('Error al completar item:', error)
            set({ errorStudyOrderItemStore: error.response?.data?.message || 'No se pudo completar el item' })
            throw error
        } finally {
            set({ isLoadingStudyOrderItemStore: false })
        }
    },

    rejectStudyOrderItem: async (id, justification) => {
        set({ isLoadingStudyOrderItemStore: true, errorStudyOrderItemStore: null })
        try {
            const response = await rejectStudyOrderItem(id, justification)
            return response
        } catch (error) {
            console.error('Error al rechazar item:', error)
            set({ errorStudyOrderItemStore: error.response?.data?.message || 'No se pudo rechazar el item' })
            throw error
        } finally {
            set({ isLoadingStudyOrderItemStore: false })
        }
    },

    editStudyOrderItem: async (id) => {
        set({ isLoadingStudyOrderItemStore: true, errorStudyOrderItemStore: null })
        try {
            const response = await editStudyOrderItem(id)
            return response
        } catch (error) {
            console.error('Error al editar item:', error)
            set({ errorStudyOrderItemStore: error.response?.data?.message || 'No se pudo editar el item' })
            throw error
        } finally {
            set({ isLoadingStudyOrderItemStore: false })
        }
    },

    completeAllStudyOrderItems: async (orderId) => {
        set({ isLoadingStudyOrderItemStore: true, errorStudyOrderItemStore: null })
        try {
            const response = await completeAllStudyOrderItems(orderId)
            return response
        } catch (error) {
            console.error('Error al completar todos los items:', error)
            set({ errorStudyOrderItemStore: error.response?.data?.message || 'Error masivo' })
            throw error
        } finally {
            set({ isLoadingStudyOrderItemStore: false })
        }
    },

    rejectAllStudyOrderItems: async (orderId, justification) => {
        set({ isLoadingStudyOrderItemStore: true, errorStudyOrderItemStore: null })
        try {
            const response = await rejectAllStudyOrderItems(orderId, justification)
            return response
        } catch (error) {
            console.error('Error al rechazar todos los items:', error)
            set({ errorStudyOrderItemStore: error.response?.data?.message || 'Error masivo' })
            throw error
        } finally {
            set({ isLoadingStudyOrderItemStore: false })
        }
    }
}))

export default useStudyOrderItemStore