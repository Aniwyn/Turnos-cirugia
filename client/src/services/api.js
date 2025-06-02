import axios from "axios";
import useAuthStore from "../store/authStore";

const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL: BASE_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Session expired, redirecting to login...")
            const logout = useAuthStore.getState().logout
            logout()
        }
        return Promise.reject(error)
    }
)

export const getAppointments = async () => {
    try {
        const response = await API.get('/appointments')
        return response.data
    } catch (error) {
        console.error("Error fetching appointments:", error)
        return []
    }
}

export const getSuccessAppointments = async () => {
    try {
        const response = await API.get('/appointments/success')
        return response.data
    } catch (error) {
        console.error("Error fetching appointments:", error)
        return []
    }
}

export const getAppointment = async (id) => {
    try {
        const response = await API.get(`/appointments/${id}`)
        return response.data
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                console.warn('Couldn\'t find appointment.')
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
}

export const getPatientByDni = async (dni) => {
    try {
        const response = await API.get(`/patients/dni/${dni}`)
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
}

export const getPatient = async (id) => {
    try {
        const response = await API.get(`/patients/${id}`)
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
}

export const getAdministrativeStatus = async () => {
    try {
        const response = await API.get('/administrative-status')
        return response.data
    } catch (error) {
        console.error("Error fetching administrative-status:", error)
        return []
    }
}

export const getMedicalStatus = async () => {
    try {
        const response = await API.get('/medical-status')
        return response.data
    } catch (error) {
        console.error("Error fetching medical-status:", error)
        return []
    }
}

export const getSurgeries = async () => {
    try {
        const response = await API.get('/surgeries')
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const getMedics = async () => {
    try {
        const response = await API.get('/medics')
        return response.data
    } catch (error) {
        console.error("Error fetching medics:", error)
        return []
    }
}

export const updateOrCreatePatient = async (patient) => {
    try {
        const response = await API.post('/patients', patient)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const createAppointment = async (appointment) => {
    try {
        const response = await API.post('/appointments', appointment)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const updateAppointment = async (appointment_id, appointment) => {
    try {
        const response = await API.put(`/appointments/${appointment_id}`, appointment)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const confirmSuccessAppointment = async (appointment_id) => {
    try {
        const response = await API.put(`/appointments/success/${appointment_id}`)
        return response.data
    } catch (error) {
        console.error("Error to confirm success appointment:", error)
        return []
    }
}

export const cancelAppointment = async (appointment_id) => {
    try {
        const response = await API.delete(`/appointments/${appointment_id}`)
        return response.data
    } catch (error) {
        console.error("Error to cancel appointment:", error)
        return []
    }
}

export const login = async (name, password) => {
    try {
        const response = await API.post('/users/login', { name, password })
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

export default API;