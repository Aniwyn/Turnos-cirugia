import { create } from 'zustand'
import { getAllPatients, createPatient, updatePatient } from '../services/patientService'

const usePatientStore = create((set, get) => ({
    patients: [],
    isLoadingPatientStore: false,
    errorPatientStore: null,

    fetchPatients: async () => {
        set({ isLoadingPatientStore: true, errorPatientStore: null })

        try {
            const data = await getAllPatients()
            set({ patients: data, isLoadingPatientStore: false })
        } catch (error) {
            console.error('Error al cargar pacientes:', error)
            set({ isLoadingPatientStore: false, errorPatientStore: 'No se pudieron cargar los pacientes' })
        }
    },

    getPatientByID: async (id) => {
        const patient = get().patients.find((l) => l.id == id)
        return patient || null
    },

    createPatient: async (newPatient) => {
        set({ isLoadingPatientStore: true, errorPatientStore: null })

        try {
            const patient = await createPatient(newPatient)
            await get().fetchPatients()
            return patient
        } catch (error) {
            console.error('Error al crear paciente:', error)
            set({ isLoadingPatientStore: false, errorPatientStore: 'No se pudo crear el paciente' })
            throw error
        }
    },

    updatePatient: async (id, updatedFields) => {
        set({ isLoadingPatientStore: true, errorPatientStore: null })

        try {
            const updated = await updatePatient(id, updatedFields)
            await get().fetchPatients()
            return updated
        } catch (error) {
            console.error('Error al actualizar paciente:', error)
            set({ isLoadingPatientStore: false, errorPatientStore: 'No se pudo actualizar el paciente' })
            throw error
        }
    }
}))

export default usePatientStore