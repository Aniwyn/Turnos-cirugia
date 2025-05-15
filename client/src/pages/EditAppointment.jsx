import { React } from 'react'
import Appointment from './Appointment'
import useAppointmentStore from '../store/useAppointmentStore'
 
const EditAppointment = () => {
    //Borrar store
    const { selectedAppointmentId, selectedPatientId } = useAppointmentStore()

    return <Appointment appointment_id={selectedAppointmentId} patient_id={selectedPatientId} />
}

export default EditAppointment