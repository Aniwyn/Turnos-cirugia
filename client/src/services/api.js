import axios from "axios"

const API_URL = "http://localhost:5000/api"

export const getAppointments = async () => {
    try {
        const response = await axios.get(`${API_URL}/appointments`)
        return response.data
    } catch (error) {
        console.error("Error fetching appointments:", error)
        return []
    }
}

export const getAppointmentByDni = async (dni) => {
    try {
        const response = await axios.get(`${API_URL}/patients/dni/${dni}`)
        console.log(response)
        return response.data
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.warn('Couldn\'t find patient.')
                return null
            }
            console.error(`Request error: ${error.response.status} - ${error.response.statusText}`)
        } else if (error.request) {
            console.error("No response received from the server.", error.request)
        } else {
            console.error("Error setting up the request:", error.message)
        }
        return null
    }
};

export const getMedicalStatus = async () => {
    try {
        const response = await axios.get(`${API_URL}/medical-status`)
        return response.data
    } catch (error) {
        console.error("Error fetching medical-status:", error)
        return []
    }
}

export const getSurgeries = async () => {
    try {
        const response = await axios.get(`${API_URL}/surgeries`)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const updateOrCreatePatient = async (patient) => {
    try {
        const response = await axios.post(`${API_URL}/patients`, patient)
        console.log("RESPONSE PATIENT", response)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const createAppointment = async (appointment) => {
    try {
        const response = await axios.post(`${API_URL}/appointments`, appointment)
        console.log("RESPONSE APOINT", response)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const login = async (name, password) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, { name, password })
        const { token, user } = response.data

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))

        return { success: true, user }
    } catch (error) {
        console.error(error)
        console.error("Login error:", error.response?.data?.message || error.message)
        return { success: false, message: error.response?.data?.message || "Login failed" }
    }
}