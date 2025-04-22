import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography } from "@material-tailwind/react"
import {
    getPatientByDni,
    getPatient,
    getAdministrativeStatus,
    getMedicalStatus,
    getSurgeries,
    getMedics,
    updateOrCreatePatient,
    createAppointment,
    getAppointment
} from "../services/api"
import useAuthStore from "../store/authStore"
import SidebarLayout from "../layouts/SidebarLayout"
import HeaderLayout from "../layouts/HeaderLayout"
import PatientForm from '../components/appointment/PatientForm'
import AppointmentForm from '../components/appointment/AppointmentForm'
import AlertMessage from "../components/AlertMessage"
import LoadingScreen from "../layouts/LoadingScreen"

const Appointment = ({ appointment_id, patient_id }) => {
    const [appointment, setAppointment] = useState({surgeries: [{ eye: "", intraocular_lens: "", surgery_id: 0 }]})
    const [patient, setPatient] = useState({})
    const [newPatient, setNewPatient] = useState(true)
    const [statuses, setStatuses] = useState([])
    const [surgeries, setSurgeries] = useState([])
    const [medics, setMedics] = useState([])
    const [surgeryDate, setSurgeryDate] = useState(null)
    const [surgeryHour, setSurgeryHour] = useState()
    const [surgeryMinute, setSurgeryMinute] = useState()
    const [alert, setAlert] = useState({ show: false })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuthStore()

    useEffect(() => {
        const userRole = getRole()

        const fetchData = async () => {
            try {
                const statusesFetched = userRole === "admin"
                    ? await getAdministrativeStatus()
                    : await getMedicalStatus()
                setStatuses(statusesFetched)

                const surgeriesFetched = await getSurgeries()
                setSurgeries(surgeriesFetched)

                const medicsFetched = await getMedics()
                setMedics(medicsFetched)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        const fetchAppointment = async () => {
            setLoading(true)
            const patient_data = await getPatient(patient_id)
            setPatient(patient_data)

            const appointment_data = await getAppointment(appointment_id)
            setAppointment({
                surgeon: appointment_data.surgeon
            })

            if (userRole == "admin") {
                setAppointment({
                    ...appointment, 
                    status: appointment_data.admin_status_id.toString(),
                    notes: appointment_data.admin_notes
                })
            } else if (userRole == "nurse") {
                setAppointment({
                    ...appointment, 
                    status: appointment_data.medical_status_id.toString(),
                    notes: appointment_data.nurse_notes
                })
            }
            
            setLoading(false)
        }

        fetchData()
        if (appointment_id && patient_id) fetchAppointment()
    }, [])

    //Manejadores de paciente
    const handlePatient = (e) => {
        const { name, value } = e.target
        setPatient((prev) => ({...prev, [name]: value}))
    }
    const handleDoctor = (val) => { setPatient((prev) => ({ ...prev, doctor_id: val })) }
    const clearMedic = () => { setPatient((prev) => ({ ...prev, doctor_id: null })) }

    //Manejadores de turno
    const handleAppointment = (e) => {
        const { name, value } = e.target
        setAppointment((prev) => ({...prev, [name]: value}))
    }
    const handleStatus = (val) => { setAppointment((prev) => ({ ...prev, status: val })) }
    const clearStatus = () => { setAppointment((prev) => ({ ...prev, status: null })) }
    const handleSurgeryHour = (val) => { setSurgeryHour(val) }
    const handleSurgeryMinute = (val) => { setSurgeryMinute(val) }
    const handleSurgeon = (val) => { setAppointment((prev) => ({ ...prev, surgeon_id: val })) }

    const getRole = () => {
        if (user.role === "Administracion" || user.role === "Admin")
            return "admin"
        else if (user.role === "Enfermeria")
            return "nurse"
        return "ERROR"
    }
    
    const findPatient = async () => {
        const patientFetched = await getPatientByDni(patient.dni)
        if (patientFetched) {
            setPatient(patientFetched)
            setNewPatient(false)
        } else {
            setAlert({
                show: true,
                message: `Paciente con DNI ${patient.dni} no encontrado.`,
                color: "red"
            })
        }
    }

    const addSurgery = () => {
        setAppointment(prev => ({
            ...prev,
            surgeries: [...prev.surgeries, { eye: "", intraocular_lens: "", surgery_id: 0 }]
        }))
    }

    const removeSurgery = (index) => {
        setAppointment(prev => ({
            ...prev,
            surgeries: prev.surgeries.filter((surgery, i) => i !== index)
        }))
    }

    const updateSurgery = (index, field, value) => {
        setAppointment(prev => ({
            ...prev,
            surgeries: prev.surgeries.map((surgery, i) =>
                i === index ? { ...surgery, [field]: value } : surgery
            )
        }))
    }

    const validateForm = () => {
        if (!patient.dni || !patient.first_name || !patient.last_name) {
            setAlert({ show: true, message: "Debe completar los datos del paciente.", color: "red" })
            return false
        }
        if (!surgeryDate || !surgeryHour || !surgeryMinute) {
            setAlert({ show: true, message: "Debe seleccionar una fecha y hora de cirugía.", color: "red" })
            return false
        }
        return true
    }

    const validateField = (field, value) => {
        let errorMessage = "";

        if (!value) {
            errorMessage = "Este campo es obligatorio.";
        } else {
            if (field === "dni" && !/^\d{7,8}$/.test(value)) {
                errorMessage = "El DNI debe tener entre 7 y 8 dígitos.";
            }
            if (field === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                errorMessage = "Correo electrónico inválido.";
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: errorMessage,
        }));
    }

    const handleNext = () => {
        if (!validateForm()) return

        const handleNextAsync = async () => {
            //juntar los dos json para la revision, sacar patient_id y agregarlo luego
            const patientJSON = {
                dni: patient.dni,
                first_name: patient.first_name,
                last_name: patient.last_name,
                phone1: patient.phone1,
                phone2: patient.phone2,
                email: patient.email,
                health_insurance: patient.health_insurance,
                doctor_id: patient.doctor_id,
            }
            const patientDB = await updateOrCreatePatient(patientJSON)

            const userRole = getRole()

            const appointmentJSON = {
                patient_id: patientDB.patient_id,
                admin_notes: userRole == "admin" ? appointment.notes : "",
                nurse_notes: userRole == "nurse" ? appointment.notes : "",
                surgery_date: surgeryDate.toISOString().split('T')[0],
                surgery_time: `${surgeryHour.padStart(2, '0')}:${surgeryMinute.padStart(2, '0')}:00`,
                surgeon_id: appointment.surgeon_id == 0 ? null : Number(appointment.surgeon_id),
                admin_status_id: userRole == "admin" ? Number(appointment.status) : 1,
                medical_status_id: userRole == "nurse" ? Number(appointment.status) : 1,
                surgeries: appointment.surgeries
            }
            console.log("TURNO: ", appointmentJSON)

            const appointmentDB = await createAppointment(appointmentJSON)
            navigate('/')
        }

        handleNextAsync()
    }

    if (loading) return <LoadingScreen loadingMenssage="Cargando turno..." />

    return (
        <SidebarLayout>
            <HeaderLayout>
                {alert.show && (
                    <AlertMessage message="" type="success" alert={alert} setAlert={setAlert} />
                )}
                <Card className='flex px-4 rounded-lg'>
                    <Typography variant='h3' className='text-center'> Registrar turno</Typography>
                    <div className='flex flex-col max-w-[50rem] mx-auto '>
                        <PatientForm 
                            patient={patient}
                            medics={medics}
                            clearMedic={clearMedic}
                            handlePatient={handlePatient}
                            handleDoctor={handleDoctor}
                            newPatient={newPatient}
                            findPatient={findPatient}
                            errors={errors}
                        />
                        <AppointmentForm
                            appointment={appointment}
                            statuses={statuses}
                            clearStatus={clearStatus}
                            surgeryDate={surgeryDate}
                            surgeryHour={surgeryHour}
                            surgeryMinute={surgeryMinute}
                            surgeries={surgeries}
                            surgeons={medics}
                            handleAppointment={handleAppointment}
                            handleStatus={handleStatus}
                            handleSurgeon={handleSurgeon}
                            handleSurgeryHour={handleSurgeryHour}
                            handleSurgeryMinute={handleSurgeryMinute}
                            setSurgeryDate={setSurgeryDate}
                            addSurgery={addSurgery}
                            removeSurgery={removeSurgery}
                            updateSurgery={updateSurgery}
                        />
                        <div className='flex justify-end gap-3 pb-10'>
                            <Button variant="outlined">Cancelar</Button>
                            <Button onClick={handleNext}>Aceptar</Button>
                        </div>
                    </div>
                </Card>
            </HeaderLayout>
        </SidebarLayout>
    )
}

export default Appointment