import api from './api'

export const getAllMedics = async () => {
    try {
        const response = await api.get('/medics/')
        return response.data
    } catch (error) {
        console.error("Error fetching medics: ", error)
        return []
    }
}