import { create } from "zustand";
import { getSuccessAppointments } from "../services/api"

const useSuccessAppointmentsStore = create((set) => ({
    successAppointments: [],
    loading: false,
    error: null,

    fetchAppointments: async () => {
        set({ loading: true, error: null })
        try {
            const data = await getSuccessAppointments()
            set({ successAppointments: data, loading: false })
        } catch (error) {
            set({ error: "Error fetching success appointments", loading: false })
        }
    },
}))

export default useSuccessAppointmentsStore