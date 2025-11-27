import { create } from 'zustand'
import { getStampById } from '../services/stampService'
import useAuthStore from './useAuthStore'

const useStampStore = create((set, get) => ({
    stamp: [],
    isLoadingStampStore: false,
    errorStampStore: null,

    fetchStampByID: async (id) => {
        set({ isLoadingStampStore: true, errorStampStore: null })
        
        try {
            const { user } = useAuthStore.getState()
            
            const data = await getStampById(user.id)
            console.log(data)
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