import { create } from 'zustand'
import { getAllStudies } from '../services/studiesService'

const useStudiesStore = create((set, get) => ({
    studies: [],
    isLoadingStudiesStore: false,
    errorStudiesStore: null,

    fetchStudies: async () => {
        set({ isLoadingStudiesStore: true, errorStudiesStore: null })

        try {
            const data = await getAllStudies()
            set({ studies: data })
        } catch (error) {
            console.error('Error al cargar estudios:', error)
            set({ errorStudiesStore: 'No se pudieron cargar los estudios' })
        } finally {
            set({ isLoadingStudiesStore: false })
        }
    },

    getStudyByID: (id) => {
        const study = get().studies.find((s) => s.id == id)
        return study || null
    },
}))

export default useStudiesStore
