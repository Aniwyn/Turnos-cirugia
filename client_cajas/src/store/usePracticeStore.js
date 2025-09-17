import { create } from 'zustand'
import { getAllPractices, createPractice, bulkUpdatePractices } from '../services/practiceService'

const usePracticeStore = create((set, get) => ({
    practices: [],
    isLoadingPracticeStore: false,
    errorPracticeStore: null,

    fetchPractices: async () => {
        set({ isLoadingPracticeStore: true, errorPracticeStore: null })

        try {
            const data = await getAllPractices()
            set({ practices: data, isLoadingPracticeStore: false })
        } catch (error) {
            console.error('Error al cargar practicas:', error)
            set({ isLoadingPracticeStore: false, errorPracticeStore: 'No se pudieron cargar las practicas' })
        }
    },

    getPracticeByID: async (id) => {
        const practice = get().practices.find((l) => l.id == id)
        return practice || null
    },

    createPractice: async (practice) => {
        set({ isLoadingPracticeStore: true, errorPracticeStore: null })

        try {
            const practiceCreated = await createPractice(practice)
            set({ isLoadingPracticeStore: false })
        } catch (error) {
            console.error('Error al cargar practicas:', error)
            set({ isLoadingPracticeStore: false, errorPracticeStore: 'No se pudieron cargar las practicas' })
        }
    },

    updatePracticeLocal: (id, field, value) => {
        const updated = get().practices.map((p) => p.id === id ? { ...p, [field]: value } : p)
        set({ practices: updated })
    },

    saveAllPractices: async () => {
        set({ isLoadingPracticeStore: true, errorPracticeStore: null })
        try {
            const updated = get().practices
            const saved = await bulkUpdatePractices(updated)
            const data = saved.data || []
            set({ practices: data, isLoadingPracticeStore: false })
        } catch (error) {
            console.error('Error guardando prácticas:', error)
            set({
                isLoadingPracticeStore: false,
                errorPracticeStore: 'No se pudieron guardar las prácticas'
            })
        }
    }
}))

export default usePracticeStore