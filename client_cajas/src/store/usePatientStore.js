import { create } from 'zustand'
import { getAllPatients, getPatientsPaginated, getFilteredPatients, getPatientByDNI, createPatient, updatePatient } from '../services/patientService'

const usePatientStore = create((set, get) => ({
    patients: [],
    totalPatients: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    queryTerms: {},
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

    fetchPatientsPaginated: async (page = 1, limit = get().pageSize) => {
        set({ isLoadingPatientStore: true, errorPatientStore: null })
        try {
            const { patients, total, totalPages } = await getPatientsPaginated(get().queryTerms, page, limit)
            set({
                patients,
                totalPatients: total,
                totalPages,
                currentPage: page
            })
        } catch (error) {
            console.error('Error al cargar pacientes:', error)
            set({ errorPatientStore: 'No se pudieron cargar los pacientes' })
        } finally {
            set({ isLoadingPatientStore: false })
        }
    },

    fetchPatientsFiltered: async (query = {}) => {
        set({ isLoadingPatientStore: true, errorPatientStore: null })
        console.log(query)
        try {
            const page = 1
            const limit = get().pageSize
            const { patients, total, totalPages } = await getFilteredPatients(query, page, limit)
            set({
                patients,
                totalPatients: total,
                totalPages,
                currentPage: page,
                queryTerms: query,
                isLoadingPatientStore: false
            })
        } catch (error) {
            console.error('Error al cargar pacientes filtrados: ', error)
            set({ isLoadingPatientStore: false, errorPatientStore: 'No se pudieron cargar los pacientes filtrados' })
        }
    },

    //MODIFICAR, NO FUNCIONA CON BUSQUEDAS PAGINADAS
    getPatientByID: async (id) => {
        const patient = get().patients.find((l) => l.id == id)
        return patient || null
    },

    getPatientByDNI: async (dni) => {
        const patient = await getPatientByDNI(dni)
        if (!patient) return null
        return patient || null
    },

    createPatient: async (newPatient) => {
        set({ isLoadingPatientStore: true, errorPatientStore: null })

        try {
            const patient = await createPatient(newPatient)
            await get().fetchPatientsFiltered()
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
            await get().fetchPatientsFiltered()
            return updated
        } catch (error) {
            console.error('Error al actualizar paciente:', error)
            set({ isLoadingPatientStore: false, errorPatientStore: 'No se pudo actualizar el paciente' })
            throw error
        }
    }
}))

export default usePatientStore