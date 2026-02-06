import api from './api'

export const getPaginatedAppointments = async (query, page, limit) => {
    try {
        const response = await api.get('/surgery-appointments/paginated', { params: { query, page, limit } })
        return response.data
    } catch (error) {
        console.error("Error fetching paginated appointments: ", error)
        return { appointments: [], total: 0, page: 1, totalPages: 1 }
    }
}

export const getFilteredAppointments = async (query, page, limit) => {
    try {
        const response = await api.get('/surgery-appointments/filter', { params: { query, page, limit } })
        return response.data
    } catch (error) {
        console.error("Error fetching filtered appointments: ", error)
        return { appointments: [], total: 0, page: 1, totalPages: 1 }
    }
}