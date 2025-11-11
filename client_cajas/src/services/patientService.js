import api from './api'

export const getAllPatients = async () => {
    try {
        const response = await api.get('/patients/')
        return response.data
    } catch (err) {
        console.error("Error fetching patients: ", err)
        return []
    }
}

export const getPatientsPaginated = async (query, page, limit) => {
    try {
        const response = await api.get('/patients/paginated', { params: { query, page, limit } })
        return response.data
    } catch (err) {
        console.error("Error fetching patients in getPatientsPaginated: ", err)
        return []
    }
}

export const getFilteredPatients = async (query, page, limit) => {
    try {
        const response = await api.get('/patients/filter', { params: { query, page, limit } })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.error("Error fetching patients in getFilteredPatients: ", err)
        return []
    }
}

export const getPatientById = async (id) => {
    try {
        const response = await api.get(`/patients/${id}`)
        return response.data
    } catch (err) {
        console.error(`Error fetching patient id ${id}: `, err)
        throw err
    }
}

export const getPatientByDNI = async (dni) => {
    try {
        const response = await api.get(`/patients/dni/${dni}`)
        return response.data
    } catch (error) {
        if (error.response.status === 404) return null
        console.error(`Error fetching patient dni ${dni}: `, error)
        throw error
    }
}

export const createPatient = async (patientData) => {
    try {
        console.log(patientData)
        const response = await api.post('/patients/', patientData)
        return response.data
    } catch (error) {
        console.error("Error creating patient: ", error)
        return []
    }
}

export const updatePatient = async (id, patientData) => {
    try {
        const response = await api.put(`/patients/${id}`, patientData)
        return response.data
    } catch (error) {
        console.error(`Error updating patient ${id}: `, error)
        return []
    }
}
