import api from './api'

export const completeStudyOrderItem = async (id) => {
    const response = await api.put(`/study-order-item/${id}/complete`)
    return response.data
}

export const rejectStudyOrderItem = async (id, justification) => {
    const response = await api.put(`/study-order-item/${id}/reject`, { justification })
    return response.data
}

export const editStudyOrderItem = async (id) => {
    const response = await api.put(`/study-order-item/${id}/edit`)
    return response.data
}

export const completeAllStudyOrderItems = async (orderId) => {
    const response = await api.put(`/study-order-item/order/${orderId}/complete-all`)
    return response.data
}

export const rejectAllStudyOrderItems = async (orderId, justification) => {
    const response = await api.put(`/study-order-item/order/${orderId}/reject-all`, { justification })
    return response.data
}