import { create } from 'zustand'
import { getStampById, getMyStamp } from '../services/stampService'

const useStampStore = create((set, get) => ({
    stamp: [],
    isLoadingStampStore: false,
    errorStampStore: null,

    fetchStampByID: async (id) => {
        set({ isLoadingStampStore: true, errorStampStore: null })
        
        try {
            const data = await getStampById(id)
            return data
        } catch (error) {
            console.error('Error al cargar practicas:', error)
            set({ errorStampStore: 'No se pudieron cargar las practicas' })
        } finally {
            set({ isLoadingStampStore: false })
        }
    },

    fetchMyStamp: async () => {
        set({ isLoadingStampStore: true, errorStampStore: null })
        
        try {
            const data = await getMyStamp()
            return data
        } catch (error) {
            console.error('Error al cargar practicas:', error)
            set({ errorStampStore: 'No se pudieron cargar las practicas' })
        } finally {
            set({ isLoadingStampStore: false })
        }
    }
}))

export default useStampStore