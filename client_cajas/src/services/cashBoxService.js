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

export const getUserCashBoxes = async () => {
    try {
        const response = await api.get('/cash-box/my')
        return response.data
    } catch (error) {
        console.error("Error fetching user boxes: ", error)
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

export const closeCashBox = async (id, { description }) => {
    try {
        const { response } = await api.put(`/cash-box/${id}/close`, { description })
        return response.data
    } catch (error) {
        console.error("Error closing box: ", error)
        return []
    }
}

export const getCashBoxById = async () => { }

export const createCashBox = async () => { }

export const updateCashBox = async () => { }

export const deleteCashBox = async () => { }