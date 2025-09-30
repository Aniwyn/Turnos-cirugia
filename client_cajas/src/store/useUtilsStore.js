import { create } from 'zustand'
import { getPdfIsj } from '../services/utilsServices'

const useUtilsStore = create((set, get) => ({
    pdf_isj: null,
    isLoadingUtilsStore: false,
    errorUtilsStore: null,

    fetchPdfIsj: async (url) => {
        set({ isLoadingUtilsStore: true, errorUtilsStore: null })

        try {
            let data = await getPdfIsj(url)

            set({ pdf: data })
            return data
        } catch (error) {
            console.error('Error al cargar cajas:', error)
            set({ errorUtilsStore: 'No se pudieron cargar las cajas' })
        } finally {
            set({ isLoadingUtilsStore: false })
        }
    },

}))

export default useUtilsStore