import api from './api'

export const getLastStudyOrders = async (limit = 5) => {
    const response = await api.get("/study-order/last", { params: { limit } })
    return response.data
}

export const getFilteredStudyOrders = async (filters) => {
    const response = await api.get("/study-order/filter", { params: filters })
    return response.data
}

export const getPendingOverdueStudies = async () => {
    const response = await api.get("/study-order/pending-overdue")
    return response.data
}

export const getStudyOrderById = async (id) => {
    const response = await api.get(`/study-order/${id}`)
    return response.data
}

export const createStudyOrder = async (studyOrder) => {
    const response = await api.post("study-order", studyOrder)
    return response.data
}

export const takeStudyOrder = async (id) => {
    const response = await api.put(`/study-order/${id}/take`)
    return response.data
}

export const cancelStudyOrder = async (id) => {
    const response = await api.put(`/study-order/${id}/cancel`)
    return response.data
}

