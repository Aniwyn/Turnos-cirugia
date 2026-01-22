import api from './api'

export const getPaginatedBudgets = async (query, page, limit) => {
    try {
        const response = await api.get('/budget/paginated', { params: { query, page, limit } })
        return response.data
    } catch (err) {
        console.error("Error fetching patients in getPaginatedBudgets: ", err)
        return []
    }
}

export const getFilteredBudgets = async (query, page, limit) => {
    try {
        const response = await api.get('/budget/filter', { params: { query, page, limit } })
        return response.data
    } catch (err) {
        console.error("Error fetching patients in getFilteredBudgets: ", err)
        return []
    }
}

export const createBudget = async (budget) => {
    const res = await api.post('/budget', budget)
    return res.data
}