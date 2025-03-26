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
