import api from './api'

export const getAllStudies = async () => {
    try {
        const response = await api.get('/studies/')
        return response.data
    } catch (error) {
        console.error("Error fetching studies: ", error)
        return []
    }
}
