import { create } from "zustand"

const useAppointmentStore = create((set) => ({
    selectedAppointmentId: null,
    selectedPatientId: null,
    setSelected: ({ appointmentId, patientId }) =>
        set({ selectedAppointmentId: appointmentId, selectedPatientId: patientId }),
    clearSelected: () =>
        set({ selectedAppointmentId: null, selectedPatientId: null })
}))

export default useAppointmentStore 