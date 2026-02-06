import { create } from 'zustand'
import { getPaginatedAppointments, getFilteredAppointments } from '../services/surgeryAppointmentsService'

const useSurgeryAppointmentStore = create((set, get) => ({
    appointments: [],
    totalAppointments: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    queryTerms: {},
    isLoading: false,
    error: null,

    fetchPaginatedAppointments: async (page = 1, limit = get().pageSize) => {
        set({ isLoading: true, error: null })
        try {
            const { appointments, total, totalPages } = await getPaginatedAppointments(get().queryTerms, page, limit)
            set({
                appointments,
                totalAppointments: total,
                totalPages,
                currentPage: page
            })
        } catch (error) {
            console.error('Error al cargar turnos paginados:', error)
            set({ error: 'No se pudieron cargar los turnos' })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchFilteredAppointments: async (query = {}) => {
        set({ isLoading: true, error: null })
        try {
            const page = 1
            const limit = get().pageSize
            const { appointments, total, totalPages } = await getFilteredAppointments(query, page, limit)
            set({
                appointments,
                totalAppointments: total,
                totalPages,
                currentPage: page,
                queryTerms: query
            })
        } catch (error) {
            console.error('Error al cargar turnos filtrados:', error)
            set({ error: 'No se pudieron cargar los turnos filtrados' })
        } finally {
            set({ isLoading: false })
        }
    },

    setQueryTerms: (terms) => set({ queryTerms: terms })
}))

export default useSurgeryAppointmentStore
