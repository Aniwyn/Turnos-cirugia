import { create } from 'zustand'
import { getAbacusPatientById, getAbacusPatientByDNI } from '../services/abacusPatientService'

const useAbacusPatientStore = create((set, get) => ({
    abacusPatient: null,
    isLoadingAbacusPatientStore: false,
    errorAbacusPatientStore: null,

    fetchAbacusPatientById: async (id) => {
        set({ isLoadingAbacusPatientStore: true, errorAbacusPatientStore: null })

        try {
            const data = await getAbacusPatientById(id)
            set({ abacusPatient: data })
            return data
        } catch (error) {
            console.error('Error al cargar paciente de Abacus por ID:', error)
            set({ errorAbacusPatientStore: 'No se pudo cargar el paciente de Abacus' })
            return null
        } finally {
            set({ isLoadingAbacusPatientStore: false })
        }
    },

    fetchAbacusPatientByDNI: async (dni) => {
        set({ isLoadingAbacusPatientStore: true, errorAbacusPatientStore: null })

        try {
            const data = await getAbacusPatientByDNI(dni)
            set({ abacusPatient: data })
            return data
        } catch (error) {
            console.error('Error al cargar paciente de Abacus por DNI:', error)
            set({ errorAbacusPatientStore: 'No se pudo cargar el paciente de Abacus' })
            return null
        } finally {
            set({ isLoadingAbacusPatientStore: false })
        }
    },

    clearAbacusPatient: () => set({ abacusPatient: null, errorAbacusPatientStore: null })
}))

export default useAbacusPatientStore
