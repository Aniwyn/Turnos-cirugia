import { create } from 'zustand'
import { getAllHealthInsurance } from '../services/healthInsuranceService'

const useHealthInsuranceStore = create((set, get) => ({
    healthInsurances: [],
    isLoadingHealthInsuranceStore: false,
    errorHealthInsuranceStore: null,

    fetchHealthInsurances: async () => {
        set({ isLoadingHealthInsuranceStore: true, errorHealthInsuranceStore: null })

        try {
            const data = await getAllHealthInsurance()
            set({ healthInsurances: data, isLoadingHealthInsuranceStore: false })
        } catch (error) {
            console.error('Error al cargar obras sociales:', error)
            set({ isLoadingHealthInsuranceStore: false, errorHealthInsuranceStore: 'No se pudieron cargar las obras sociales' })
        }
    }
}))

export default useHealthInsuranceStore