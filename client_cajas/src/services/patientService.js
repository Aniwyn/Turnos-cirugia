import api from './api'

export const getAllPatients = async () => {
    try {
        const response = await api.get('/patients/')
        return response.data
    } catch (error) {
        console.error("Error fetching patients: ", error)
        return []
    }
}

export const getPatientById = async (id) => {
    try {
        const response = await api.get(`/patients/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching patient id ${id}: `, error)
        throw error
    }
}

export const getPatientByDNI = async (dni) => {
    try {
        const response = await api.get(`/patients/dni/${dni}`)
        return response.data
    } catch (error) {
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