import api from './api'

export const getAllLabels = async () => {
    try {
        const response = await api.get('/cash-movement/label/')
        return response.data
    } catch (error) {
        console.error("Error fetching labels:", error)
        return []
    }
}

export const getLabelById = async (id) => {
    try {
        const response = await api.get(`/cash-movement/label/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching label:", error)
        return {}
    }
}