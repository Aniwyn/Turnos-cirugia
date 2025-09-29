import api from './api'

export const getPdfIsj = async (url) => {
    try {
        const response = await api.get(`/utils/pdf_isj?url=${encodeURIComponent(url)}`)
        return response.data
    } catch (error) {
        console.error("Error fetching pdf: ", error)
        return []
    }
}