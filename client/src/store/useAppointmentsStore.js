import { create } from "zustand"
import { getAppointments } from "../services/api"

const useAppointmentsStore = create((set) => ({
    appointments: [],
    loading: false,
    error: null,

    fetchAppointments: async () => {
        set({ loading: true, error: null })
        try {
            const data = await getAppointments()
            set({ appointments: data, loading: false })
        } catch (error) {
            set({ error: "Error fetching appointments", loading: false })
        }
    },
}))

export default useAppointmentsStore