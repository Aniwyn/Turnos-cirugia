import api from './api'

export const getAllCashBox = async () => {
    try {
        const response = await api.get('/cash-box/')
        return response.data
    } catch (error) {
        console.error("Error fetching boxes: ", error)
        return []
    }
}

export const getCashBoxesPaginated = async (query, page, limit) => {
    try {
        const response = await api.get('/cash-box/paginated', { params: { query, page, limit } })
        return response.data
    } catch (error) {
        console.error("Error fetching paginated cash boxes: ", error)
        return []
    }
}

export const getUserCashBoxesPaginated = async (query, page, limit) => {
    try {
        const response = await api.get('/cash-box/my', { params: { query, page, limit } })
        return response.data
    } catch (error) {
        console.error("Error fetching cash boxes: ", error)
        return []
    }
}

export const getMyActiveCashBox = async () => {
    try {
        const response = await api.get('/cash-box/my/active')
        return response.data
    } catch (error) {
        console.error("Error fetching active cash box: ", error)
        return []
    }
}

export const getCashBoxById = async (id) => {
    try {
        const response = await api.get(`/cash-box/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching cash box with id (${id}): `, error)
        return []
    }
}

export const getMyOpenCashBox = async () => {
    try {
        const response = await api.get('/cash-box/my/open')
        return response.data
    } catch (error) {
        console.error("Error fetching open cash box: ", error)
        return null
    }
}

export const getAvailableForMainBox = async () => {
    try {
        const response = await api.get('/cash-box/available-for-main-box')
        return response.data
    } catch (error) {
        console.error("")
        return []
    }
}

export const closeCashBox = async (id, { description }) => {
    try {
        const response = await api.put(`/cash-box/${id}/close`, { description })
        return response.data
    } catch (error) {
        console.error("Error closing box: ", error)
        return []
    }
}

export const linkMainBox = async (id, mainBoxId) => {
    try {
        const response = await api.put(`/cash-box/${id}/link-main-box`, { mainBoxId })
        return response.data
    } catch (error) {
        console.error("Error unlinking cash box: ", error)
        return []
    }
}

export const unlinkMainBox = async (id) => {
    try {
        const response = await api.put(`/cash-box/${id}/unlink-main-box`)
        return response.data
    } catch (error) {
        console.error("Error unlinking cash box: ", error)
        return []
    }
}


export const createCashBox = async () => { }

export const updateCashBox = async () => { }

export const deleteCashBox = async () => { }