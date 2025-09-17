import api from './api'

export const getAllPractices = async () => {
    try {
        const response = await api.get('/practices/')
        return response.data
    } catch (err) {
        console.error("Error fetching practices: ", err)
        return []
    }
}

export const createPractice = async (practice) => {
    try {
        const res = await api.post('/practices', practice)
        return res.data
    } catch (err) {
        console.error("Error creating practice: ", err)
        return []
    }
}

export const bulkUpdatePractices = async (updates) => {
    try {
        const res = await api.put('/practices/bulk', updates)
        return res.data
    } catch (err) {
        console.error("Error updating practices: ", err)
        return []
    }
}