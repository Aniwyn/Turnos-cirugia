import api from './api'

export const getAllMainBoxes = async () => {
    try {
        const response = await api.get('/main-box/')
        return response.data
    } catch (error) {
        console.error("Error fetching main boxes: ", error)
        return []
    }
}

export const getMainBoxesPaginated = async (query, page, limit) => {
    try {
        const response = await api.get('/main-box/paginated', { params: { query, page, limit } })
        return response.data
    } catch (error) {
        console.error("Error fetching paginated main boxes: ", error)
        return []
    }
}

export const getMyActiveMainBox = async () => {
    try {
        const response = await api.get('/main-box/my/active')
        return response.data
    } catch (error) {
        console.error("Error fetching active main box: ", error)
        return []
    }
}

export const getCashBoxesForMainBox = async (id) => {
    try {
        const response = await api.get(`/main-box/${id}/cash-boxes`)
        return response.data
    } catch (error) {
        console.error("Error fetching cash boxes for main box: ", error)
        return []
    }
}

export const getMainBoxById = async (id) => {
    try {
        const response = await api.get(`/main-box/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching main box with id (${id}): `, error)
        return []
    }
}

export const closeMainBoxService = async (id) => {
    try {
        const response = await api.post(`/main-box/${id}/close`)
        return response.data
    } catch (error) {
        console.error("Error closing main box: ", error)
        return []
    }
}