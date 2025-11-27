import api from './api'

export const getAllAccountingLedger = async () => {
    try {
        const { data } = await api.get('/accounting-ledger')
        return data
    } catch (error) {
        console.error('Error getting accounting ledger', error)
        throw error
    }
}

export const getPaginatedAccountingLedger = async (query = {}, page = 1, limit = 10) => {
    try {
        const { data } = await api.get('/accounting-ledger/paginated', { params: { query, page, limit } })
        return data
    } catch (error) {
        console.error('Error getting paginated accounting ledger', error)
        throw error
    }
}

export const getAccountingLedgerByDateRange = async (startDate, endDate) => {
    try {
        const query = []

        if (startDate) query.push(`start_date=${startDate}`)
        if (endDate) query.push(`end_date=${endDate}`)

        const queryString = query.length ? `?${query.join('&')}` : ''

        const response = await api.get(`/accounting-ledger/range${queryString}`)
        return response.data
    } catch (error) {
        console.error('Error getting accounting ledger by date range', error)
        throw error
    }
}

export const getLastAccountingLedger = async () => {
    try {
        const { data } = await api.get('/accounting-ledger/last')
        return data
    } catch (error) {
        console.error('Error getting last accounting ledger', error)
        throw error
    }
}
