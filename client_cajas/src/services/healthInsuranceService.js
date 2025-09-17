import api from './api'

export const getAllHealthInsurance = async () => {
    try {
        const response = await api.get('/health_insurance/')
        return response.data
    } catch (error) {
        console.error("Error fetching health insurances: ", error)
        return []
    }
}