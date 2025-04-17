import axios from "axios";
import useAuthStore from "../store/authStore";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
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
        console.log("RESPONSe APPO",response)
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

export const updateOrCreatePatient = async (patient) => {
    try {
        const response = await API.post('/patients', patient)
        console.log("RESPONSE PATIENT", response)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
        return []
    }
}

export const createAppointment = async (appointment) => {
    try {
        const response = await API.post('/appointments', appointment)
        console.log("RESPONSE APOINT", response)
        return response.data
    } catch (error) {
        console.error("Error fetching surgeries:", error)
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