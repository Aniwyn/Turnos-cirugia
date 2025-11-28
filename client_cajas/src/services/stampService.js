import api from './api'

export const getStampById = async (id) => {
    try {
        const res = await api.get(`/stamp/user/${id}`)
        return res.data
    } catch (err) {
        console.error("Error fetching stamp: ", err)
        return {}
    }
}

export const getMyStamp = async () => {
    try {
        const res = await api.get(`/stamp/my`)
        return res.data
    } catch (err) {
        console.error("Error fetching my stamp: ", err)
        return {}
    }
}