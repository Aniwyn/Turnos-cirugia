import api from './api'

export const getAllCashMovements = async () => {
    try {
        const response = await api.get('/cash-movement/')
        console.log(response)
        return response.data
    } catch (error) {
        console.error("Error fetching movements: ", error)
        return []
    }
}

export const getUserCashMovements = async () => {
    try {
        const response = await api.get('/cash-movement/my')
        return response.data
    } catch (error) {
        console.error("Error fetching movements: ", error)
        return []
    }
}

export const getCashMovementById = async (id) => {
    try {
        const response = await api.get(`/cash-movement/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching movement: ", error)
        return {}
    }
}

export const createCashMovement = async (movement) => {
    try {
        const response = await api.post('/cash-movement/', { movement })
        return response.data
    } catch (error) {
        console.error("Error creating movement: ", error)
        return {}
    }
}

export const updateCashMovement = async (id, movement) => {
    try {
        const response = await api.put(`/cash-movement/${id}`, { movement })
        return response.data
    } catch (error) {
        console.error("Error deleting movement: ", error)
        return {}
    }
}

export const deleteCashMovement = async (id) => {
    try {
        const response = await api.delete(`/cash-movement/${id}`)
        return response
    } catch (error) {
        console.error("Error deleting movement: ", error)
        return {}
    }
}