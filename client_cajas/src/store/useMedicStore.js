import { create } from 'zustand'
import { getAllMedics } from '../services/medicService'

const useMedicStore = create((set, get) => ({
    medics: [],
    isLoadingMedicStore: false,
    errorMedicStore: null,

    fetchMedics: async () => {
        set({ isLoadingMedicStore: true, errorMedicStore: null })

        try {
            const data = await getAllMedics()
            set({ medics: data, isLoadingMedicStore: false })
            console.log(data)
        } catch (error) {
            console.error('Error al cargar medicos:', error)
            set({ isLoadingMedicStore: false, errorMedicStore: 'No se pudieron cargar los medicos' })
        }
    },

    getPatientByID: async (id) => {
        const medic = get().medics.find((l) => l.id == id)
        return medic || null
    }
}))

export default useMedicStore