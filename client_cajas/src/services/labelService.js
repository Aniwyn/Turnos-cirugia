import api from './api'

export const getAllLabels = async () => {
    try {
        const response = await api.get('/labels/')
        return response.data
    } catch (error) {
        console.error("Error fetching labels:", error)
        return []
    }
}

export const getLabelById = async (id) => {
    try {
        const response = await api.get(`/labels/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching label:", error)
        return {}
    }
}