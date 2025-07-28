import { create } from 'zustand'
import { getAllLabels, getLabelById } from '../services/labelService'

const useLabelStore = create((set, get) => ({
    labels: [],
    isLoading: false,
    error: null,

    fetchLabels: async () => {
        set({ isLoading: true, error: null })

        try {
            const data = await getAllLabels()
            set({ labels: data, isLoading: false })
        } catch (error) {
            console.error('Error al cargar labels:', error)
            set({ isLoading: false, error: 'No se pudieron cargar las etiquetas' })
        }
    },

    getLabelById: (id) => {
        const label = get().labels.find((l) => l.id === id)
        return label || null
    }
}))

export default useLabelStore