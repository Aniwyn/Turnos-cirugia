import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Typography } from "@material-tailwind/react"
import {
    getPatientByDni,
    getPatient,
    getAdministrativeStatus,
    getMedicalStatus,
    getSurgeries,
    getMedics,
    createAppointment,
    updateAppointment,
    getAppointment,
    cancelAppointment
} from "../services/api"
import useAuthStore from "../store/authStore"
import SidebarLayout from "../layouts/SidebarLayout"
import HeaderLayout from "../layouts/HeaderLayout"
import PatientForm from '../components/appointment/PatientForm'
import AppointmentForm from '../components/appointment/AppointmentForm'
import AlertMessage from "../components/AlertMessage"
import LoadingScreen from "../layouts/LoadingScreen"
import { ConfirmDialog } from '../components/ConfirmDialog'
import IncidentForm from '../components/appointment/IncidentForm'

const Appointment = ({ appointment_id, patient_id }) => {
    const [appointment, setAppointment] = useState({
        surgeries: [{ eye: undefined, intraocular_lens: "", surgery_id: undefined }]
    })
    const [patient, setPatient] = useState({})
    const [newPatient, setNewPatient] = useState(true)
    const [statuses, setStatuses] = useState([])
    const [surgeries, setSurgeries] = useState([])
    const [medics, setMedics] = useState([])
    const [surgeryDate, setSurgeryDate] = useState(null)
    const [surgeryHour, setSurgeryHour] = useState()
    const [surgeryMinute, setSurgeryMinute] = useState()
    const [alert, setAlert] = useState({ show: false })
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
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
                console.log(surgeriesFetched)
                setSurgeries(surgeriesFetched)

                const medicsFetched = await getMedics()
                setMedics(medicsFetched)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        const fetchAppointment = async () => {
            try {
                setLoading(true)

                const patient_data = await getPatient(patient_id)
                const appointment_data = await getAppointment(appointment_id)

                const basePatient = {
                    ...patient_data,
                    medic_id: { value: patient_data.Medic?.id, label: patient_data.Medic?.name }
                }
                const baseAppointment = {
                    status: undefined,
                    notes: "",
                    incidents: "",
                    surgeries: []
                }

                if (appointment_data.surgery_date) {
                    const parsedDate = new Date(appointment_data.surgery_date + 'T00:00:00')
                    setSurgeryDate(parsedDate)
                }

                if (appointment_data.surgery_time) {
                    const [surgeryHour_data, surgeryMinute_data] = appointment_data.surgery_time.split(":")
                    setSurgeryHour({ value: surgeryHour_data, label: surgeryHour_data })
                    setSurgeryMinute({ value: surgeryMinute_data, label: surgeryMinute_data })
                }

                if (appointment_data.Surgeries) {
                    for (let i = 0; i < appointment_data.Surgeries.length; i++) {
                        baseAppointment.surgeries.push({
                            eye: { value: appointment_data.Surgeries[i].appointment_surgery.eye, label: appointment_data.Surgeries[i].appointment_surgery.eye },
                            intraocular_lens: appointment_data.Surgeries[i].appointment_surgery.intraocular_lens,
                            surgery_id: { 
                                value: appointment_data.Surgeries[i].id,
                                label: appointment_data.Surgeries[i].name,
                                useLens: appointment_data.Surgeries[i].useLens 
                            },
                        })
                    }
                }

                if (appointment_data.Medic) {
                    baseAppointment.surgeon_id = { value: appointment_data.Medic.id, label: appointment_data.Medic.name }
                }

                if (userRole === "admin") {
                    baseAppointment.status = {
                        value: appointment_data.AdministrativeStatus.id,
                        label: appointment_data.AdministrativeStatus.name
                    } || {}
                    baseAppointment.notes = appointment_data.admin_notes || ""
                    baseAppointment.incidents = appointment_data.admin_incidents || ""
                } else if (userRole === "nurse") {
                    baseAppointment.status = {
                        value: appointment_data.MedicalStatus.id,
                        label: appointment_data.MedicalStatus.name
                    } || {}
                    baseAppointment.notes = appointment_data.nurse_notes || ""
                    baseAppointment.incidents = appointment_data.nurse_incidents || ""
                }

                setPatient(basePatient)
                setAppointment(baseAppointment)
            } catch (err) {
                console.error("Error fetching appointment:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        if (appointment_id && patient_id) fetchAppointment()
    }, [])

    //Manejadores de paciente
    const handlePatient = (e) => {
        const { name, value } = e.target
        validateField(name, value)
        setPatient((prev) => ({ ...prev, [name]: value }))
    }
    const handleMedic = (val) => { console.log(val); setPatient((prev) => ({ ...prev, medic_id: val })) }

    //Manejadores de turno
    const handleAppointment = (e) => {
        const { name, value } = e.target
        setAppointment((prev) => ({ ...prev, [name]: value }))
    }
    const handleStatus = (val) => { setAppointment((prev) => ({ ...prev, status: val })) }
    const handleSurgeryHour = (val) => { setSurgeryHour(val) }
    const handleSurgeryMinute = (val) => { setSurgeryMinute(val) }
    const handleSurgeon = (val) => { setAppointment((prev) => ({ ...prev, surgeon_id: val })) }

    const getRole = () => {
        if (user.role === "admin")
            return "admin"
        else if (user.role === "nurse")
            return "nurse"
        return "ERROR"
    }

    const findPatient = async () => {
        const patientFetched = await getPatientByDni(patient.dni)
        console.log(patientFetched)
        if (patientFetched) {
            const basePatient = {
                ...patientFetched,
                medic_id: { value: patientFetched.Medic?.id, label: patientFetched.Medic?.name }
            }
            setPatient(basePatient)
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
            surgeries: [...(prev.surgeries || []), { eye: undefined, intraocular_lens: "", surgery_id: undefined }]
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
        } else return true
    }

    const validateField = (field, value) => {
        if (field != "dni" && field != "first_name" && field != "last_name") return
        let errorMessage = ""

        if (!value) {
            errorMessage = "Este campo es obligatorio."
        } else {
            if (field === "dni" && !/^\d{7,8}$/.test(value)) {
                errorMessage = "El DNI debe tener entre 7 y 8 dígitos."
            }
            if (field === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
                errorMessage = "Correo electrónico inválido."
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: errorMessage,
        }))
    }

    const handleNext = () => {
        if (!validateForm()) return

        const handleNextAsync = async () => {
            let surgery_time_picked
            if (surgeryHour && !surgeryMinute)
                surgery_time_picked = surgeryHour ? `${surgeryHour?.value.padStart(2, '0')}:00:00` : null
            else
                surgery_time_picked = surgeryHour && surgeryMinute ? `${surgeryHour?.value.padStart(2, '0')}:${surgeryMinute?.value.padStart(2, '0')}:00` : null

            const surgeriesToBack = []
            for (let i = 0; i < appointment.surgeries.length; i++) {
                if (appointment.surgeries[i].surgery_id) {
                    let lens
                    if (appointment.surgeries[i].surgery_id.useLens == 1) { //Si la cirugia no es una que usa lentes omitir dato
                        lens = appointment.surgeries[i].intraocular_lens
                    } else {
                        lens = ""
                    }
                    surgeriesToBack.push({
                        eye: appointment.surgeries[i].eye?.value,
                        intraocular_lens: lens,
                        surgery_id: appointment.surgeries[i].surgery_id.value
                    })
                }
            }

            const appointmentJSON = {
                dni: patient.dni,
                first_name: patient.first_name,
                last_name: patient.last_name,
                phone1: patient.phone1,
                phone2: patient.phone2,
                email: patient.email,
                health_insurance: patient.health_insurance,
                medic_id: patient.medic_id?.value,
                notes: appointment.notes,
                incidents: appointment.incidents,
                surgery_date: surgeryDate ? surgeryDate?.toISOString().split('T')[0] : null,
                surgery_time: surgery_time_picked,
                surgeon_id: appointment.surgeon_id?.value,
                status_id: appointment.status ? appointment.status?.value : 1,
                surgeries: surgeriesToBack
            }

            if (appointment_id && patient_id) {
                const appointmentDB = await updateAppointment(appointment_id, appointmentJSON)
            } else {
                const appointmentDB = await createAppointment(appointmentJSON)
            }
            navigate('/')
        }

        handleNextAsync()
    }

    const handleCancel = () => {
        navigate('/')
    }

    const handleDelete = () => {
        const deleteAppointment = async () => {
            await cancelAppointment(appointment_id)
            navigate('/')
        }

        deleteAppointment()
    }

    if (loading) return <LoadingScreen loadingMenssage="Cargando turno..." />

    return (
        <SidebarLayout>
            <HeaderLayout>
                {alert.show && (
                    <AlertMessage message="" type="success" alert={alert} setAlert={setAlert} />
                )}
                <ConfirmDialog
                    open={openConfirmDialog}
                    setOpen={setOpenConfirmDialog}
                    title="Eliminar Turno"
                    subTitle="¿Estas seguro que desea eliminar el turno?"
                    confirmFunction={handleDelete}
                />
                <Card className='flex px-4 rounded-lg min-w-[800px]'>
                    <Typography variant='h3' className='text-center'> Registrar turno</Typography>
                    <div className='flex flex-col min-w-[700px] max-w-[50rem] mx-auto '>
                        <PatientForm
                            patient={patient}
                            medics={medics}
                            handlePatient={handlePatient}
                            handleMedic={handleMedic}
                            newPatient={newPatient}
                            findPatient={findPatient}
                            errors={errors}
                        />
                        <AppointmentForm
                            appointment={appointment}
                            statuses={statuses}
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
                        <IncidentForm
                            appointment={appointment}
                            handleAppointment={handleAppointment}
                        />
                        <div className='flex justify-between'>
                            {appointment_id && patient_id ?
                                <div className='flex justify-end gap-3 pb-10'>
                                    <Button onClick={() => setOpenConfirmDialog(true)} variant="outlined" color='red'>Eliminar</Button>
                                </div>
                                :
                                <div className='flex justify-end gap-3 pb-10'></div>
                            }
                            <div className='flex justify-end gap-3 pb-10'>
                                <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
                                <Button onClick={handleNext}>Aceptar</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </HeaderLayout>
        </SidebarLayout>
    )
}

export default Appointment