import { create } from 'zustand'
import { getAllAccountingLedger, getPaginatedAccountingLedger, getAccountingLedgerByDateRange, getLastAccountingLedger } from '../services/accountingLedgerService'

const useAccountingLedgerStore = create((set, get) => ({
    allLedger: [],
    ledger: [],
    ledgers: [],
    pagination: {
        totalItems: 0,
        totalPages: 1,
        currentPage: 1
    },
    isLoadingLedgerStore: false,
    errorLedgerStore: null,

    fetchLedger: async () => {
        set({ isLoadingLedgerStore: true, errorLedgerStore: null })

        try {
            const data = await getAllAccountingLedger()
            set({ allLedger: data })
        } catch (error) {
            set({ errorLedgerStore: 'No se pudo obtener el historial contable' })
        } finally {
            set({ isLoadingLedgerStore: false })
        }
    },

    fetchPaginatedLedger: async (query = {}, page = 1, limit = 10) => {
        set({ isLoadingLedgerStore: true, errorLedgerStore: null })
        try {
            const { data, totalItems, totalPages, currentPage } = await getPaginatedAccountingLedger(query, page, limit)
            set({
                ledgers: data,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage
                }
            })
            
            return data
        } catch (error) {
            set({ errorLedgerStore: 'No se pudo obtener el historial contable paginado' })
        } finally {
            set({ isLoadingLedgerStore: false })
        }
    },

    fetchLedgerByRange: async (startDate, endDate) => {
        set({ isLoadingLedgerStore: true, errorLedgerStore: null })

        try {
            const { data } = await getAccountingLedgerByDateRange(startDate, endDate)
            return data
        } catch (error) {
            set({ errorLedgerStore: 'No se pudo obtener el historial por rango de fecha' })
        } finally {
            set({ isLoadingLedgerStore: false })
        }
    },

    fetchLastAccountingLedger: async () => {
        set({ isLoadingLedgerStore: true, errorLedgerStore: null })

        try {
            const data = await getLastAccountingLedger()
            return data
        } catch (error) {
            set({ errorLedgerStore: 'No se pudo obtener el último registro contable' })
        } finally {
            set({ isLoadingLedgerStore: false })
        }
    }

}))

export default useAccountingLedgerStore
