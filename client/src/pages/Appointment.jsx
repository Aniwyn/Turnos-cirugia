import { React, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Button, IconButton, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react"
import { 
    getPatientByDni,
    getAdministrativeStatus, 
    getMedicalStatus,
    getSurgeries,
    updateOrCreatePatient,
    createAppointment 
} from "../services/api"
import useAuthStore from "../store/authStore"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import SidebarLayout from "../layouts/SidebarLayout"
import HeaderLayout from "../layouts/HeaderLayout"
import DatePicker from "../components/DatePicker"
import AlertMessage from "../components/AlertMessage"

const tmpPatient = {
    id: null,
    dni: "",
    first_name: "",
    last_name: "",
    doctor_id: null,
    phone1: "",
    phone2: "",
    email: "",
    health_insurance: ""
}

const tmpPatient2 = {
    id: null,
    dni: "12345670",
    first_name: "Pruebas",
    last_name: "ApePruebas",
    doctor_id: null,
    phone1: "123",
    phone2: "456",
    email: "pruebas@no.se",
    health_insurance: "OSASD"
}

//separar relaciones anidadas
const tmpAppoiment = {
    surgeon_id: "0",
    status: null,
    surgeries: [
        { eye: "", intraocular_lens: "", surgery_id: 0 }
    ]
}

//modificar base de datos
const doctors = [
    { id: 1, name: 'Dr. Siufi Lucas' },
    { id: 2, name: 'Dr. Siufi Ernesto' },
    { id: 3, name: 'Dr. Abud Valeria' },
    { id: 4, name: 'Dr. Ase Veronica' },
]

const Appointment = ({ appointment_id, patient_id }) => {
    const [patient, setPatient] = useState(tmpPatient)
    const [newPatient, setNewPatient] = useState(true)
    const [appointment, setAppointment] = useState(tmpAppoiment)
    const [statuses, setStatuses] = useState([])
    const [surgeries, setSurgeries] = useState([])
    const [surgeryDate, setSurgeryDate] = useState(null)
    const [surgeryHour, setSurgeryHour] = useState()
    const [surgeryMinute, setSurgeryMinute] = useState()
    const [alert, setAlert] = useState({ show: false })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const { user } = useAuthStore()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statusesFetched = user.role === "Administracion" || user.role === "Admin"
                    ? await getAdministrativeStatus()
                    : await getMedicalStatus()

                setStatuses(statusesFetched)

                const surgeriesFetched = await getSurgeries()
                setSurgeries(surgeriesFetched)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        const fetchAppointment = async () => {
            //const appointment_data = 
        }

        console.log(appointment_id, "     asda das   ", patient_id)

        fetchData()
        //if (id_appointment && id_patient) fetchAppointment()
    }, [])

    useEffect(() => {
        console.log(appointment.surgeries)
    }, [appointment])

    //Manejadores de paciente
    /*
    Manejar de forma dinamica, agregar "name" a los input y 
    const handleChangePatient = (e) => {
        const { name, value } = e.target;
        setPatient(prev => ({ ...prev, [name]: value }));
    };
    Algo asi (?
    */

    //generalizar para los demas campos
    const handleDni = (e) => {
        setPatient((prev) => ({ ...prev, dni: e.target.value }))
        validateField("dni", e.target.value)
    }
    const handleFirsName = (e) => {
        setPatient((prev) => ({ ...prev, first_name: e.target.value }))
        validateField("first_name", e.target.value)
    }
    const handleLastName = (e) => {
        setPatient((prev) => ({ ...prev, last_name: e.target.value }))
        validateField("last_name", e.target.value)
    }
    const handlePhone1 = (e) => { setPatient((prev) => ({ ...prev, phone1: e.target.value })) }
    const handlePhone2 = (e) => { setPatient((prev) => ({ ...prev, phone2: e.target.value })) }
    const handleEmail = (e) => { setPatient((prev) => ({ ...prev, email: e.target.value })) }
    const handleHealthInsurance = (e) => { setPatient((prev) => ({ ...prev, health_insurance: e.target.value })) }
    const handleDoctor = (val) => { setPatient((prev) => ({ ...prev, doctor_id: val })) }

    //Manejadores de turno
    /*
    IDEM PATIENT - completar name en los input
    const handleChangeAppointment = (field, value) => {
        setAppointment(prev => ({ ...prev, [field]: value }));
    };

    Los select
    <Select label="Estado" onChange={(val) => handleChangeAppointment(user.role == "Administracion" || user.role == "Admin" ? 'admin_status_id' : 'medical_status_id', val)}>


    */
    const handleNotes = (e) => { setAppointment((prev) => ({ ...prev, note: e.target.value }))
        /*if (user.role == "Administracion" || user.role == "Admin") {
            setAppointment((prev) => ({ ...prev, admin_notes: e.target.value }))
        } else if (user.role == "Enfermeria") {
            setAppointment((prev) => ({ ...prev, nurse_notes: e.target.value }))
        }*/
    }
    const handleStatus = (val) => { setAppointment((prev) => ({ ...prev, status: val })) }
    const clearStatus = () => { setAppointment((prev) => ({ ...prev, status: null })) }
    const handleSurgeryHour = (val) => { setSurgeryHour(val) }
    const handleSurgeryMinute = (val) => { setSurgeryMinute(val) }
    const handleSurgeon = (val) => { setAppointment((prev) => ({ ...prev, surgeon_id: val })) }

    const findPatient = async () => {
        const patientFetched = await getPatientByDni(patient.dni)
        if (patientFetched) {
            setPatient(patientFetched)
            setNewPatient(false)
        } else {
        console.log("ERROR EN ALERTA")
            setAlert({
                show: true,
                message: `Paciente con DNI ${patient.dni} no encontrado.`,
                color: "red"
            })
        }
    }

    //dev
    /*useEffect(() => {
        console.log(appointment.medical_status_id)
    },[appointment])*/

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

    function getStatusField() {
        if (user.role === "Administracion" || user.role === "Admin") return "admin_status_id"
        if (user.role === "Enfermeria") return "medical_status_id"
        return null
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

            let userRole
            if (user.role === "Administracion" || user.role === "Admin") 
                userRole = "admin"
            else if (user.role === "Enfermeria") return "medical_status_id"
                userRole = "nurse"

            const appointmentJSON = {
                patient_id: patientDB.patient_id,
                admin_notes: appointment.userRole == "admin" ? appointment.notes : null,
                nurse_notes: appointment.userRole == "nurse" ? appointment.notes : null,
                surgery_date: surgeryDate.toISOString().split('T')[0],
                surgery_time: `${surgeryHour.padStart(2, '0')}:${surgeryMinute.padStart(2, '0')}:00`,
                surgeon_id: appointment.surgeon_id == 0 ? null : Number(appointment.surgeon_id),
                admin_status_id: appointment.userRole == "admin" ? Number(appointment.status) : null,
                medical_status_id: appointment.userRole == "nurse" ? Number(appointment.status) : null,
                surgeries: appointment.surgeries
            }
            const appointmentDB = await createAppointment(appointmentJSON)
            console.log(appointmentJSON)
            navigate('/')
        }

        handleNextAsync()
    }

    return (
        <SidebarLayout>
            <HeaderLayout>
                {alert.show && (
                    <AlertMessage message="" type="success" alert={alert} setAlert={setAlert} />
                )}
                <Card className='flex px-4 rounded-lg'>
                    <Typography variant='h3' className='text-center'> Registrar turno</Typography>
                    <div className='flex flex-col max-w-[50rem] mx-auto '>
                        <div className='flex flex-col w-full mx-auto pb-5'>
                            <div className='flex'>
                                <Typography className='font-bold flex pb-3'>Paciente</Typography>
                                <Typography className='text-red-800'>*</Typography>
                            </div>
                            <div className='flex pb-3'>
                                <div className='flex w-1/2'>
                                <Input variant='outlined' label="DNI *" placeholder='12345678' value={patient.dni} onChange={handleDni} className='' disabled={!newPatient} autoFocus />
                                <Button onClick={findPatient} className='w-full' disabled={!newPatient || errors.dni}>Buscar</Button>
                                </div>
                                {errors.dni && <Typography color="red" variant="small" className='content-center ps-4'>{errors.dni}</Typography>}
                            </div>
                            <div className='flex pb-3 gap-3'>
                                <div className='flex-col w-full'>
                                    <Input variant='outlined' label="Nombre/s *" placeholder='Perez' value={patient.first_name} onChange={handleFirsName} />
                                    {errors.first_name && <Typography color="red" variant="small">{errors.first_name}</Typography>}
                                </div>
                                <div className='flex flex-col w-full'>
                                    <Input variant='outlined' label="Apellido/s *" placeholder='Juan Pablo' value={patient.last_name} onChange={handleLastName} />
                                    {errors.last_name && <Typography color="red" variant="small">{errors.last_name}</Typography>}
                                </div>
                            </div>
                            
                            <div className='flex pb-3 gap-3'>
                                <Input variant='outlined' label="Obra social" placeholder='PAMI' value={patient.health_insurance} onChange={handleHealthInsurance} />
                                <div className='flex w-full'>
                                    <Select
                                        label="Médico"
                                        value={patient.doctor_id}
                                        onChange={handleDoctor}
                                        name='FUNCIONA'
                                    >
                                        {
                                            doctors.map(doc => {
                                                return (
                                                    <Option key={doc.id} value={doc.id.toString()}>{doc.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    <IconButton variant="text" disabled={!patient.doctor_id}>
                                        <XMarkIcon className="h-6 w-6 text-red-500" onClick={() => setPatient((prev) => ({ ...prev, doctor_id: null }))}/>
                                    </IconButton>
                                </div>
                            </div>
                            <div className='flex pb-3 gap-3'>
                                <Input variant='outlined' label="Tel 1" placeholder='3881234567' value={patient.phone1} onChange={handlePhone1} />
                                <Input variant='outlined' label="Tel 2" placeholder='3881234567' value={patient.phone2} onChange={handlePhone2} />
                            </div>
                            <div className='flex'>
                                <Input variant='outlined' label='Email' placeholder='correo@gmail.com' value={patient.email} onChange={handleEmail} />
                            </div>
                        </div>
                        <div>
                            <Typography className='font-bold flex pb-3'>Turno</Typography>
                            <div className='pb-5'>
                                <div className='flex pb-3'>
                                    <Select
                                        label="Estado"
                                        value={appointment.status}
                                        onChange={handleStatus}
                                        key={statuses.length}
                                    >
                                        {
                                            statuses.map(status => {
                                                return (
                                                    <Option key={status.id} value={status.id.toString()}>{`${status.name}`}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                    <IconButton variant="text" onClick={clearStatus} disabled={!appointment.status}>
                                        <XMarkIcon className="h-6 w-6 text-red-500" />
                                    </IconButton>
                                </div>
                                <div className='flex pb-3 gap-3'>
                                    <DatePicker title="Fecha" date={surgeryDate} setDate={setSurgeryDate} />
                                    <Select
                                        label="Hora"
                                        value={surgeryHour}
                                        onChange={handleSurgeryHour}
                                    >
                                        <Option value='6'>6</Option>
                                        <Option value='7'>7</Option>
                                        <Option value='8'>8</Option>
                                        <Option value='9'>9</Option>
                                        <Option value='10'>10</Option>
                                        <Option value='11'>11</Option>
                                        <Option value='12'>12</Option>
                                        <Option value='13'>13</Option>
                                        <Option value='14'>14</Option>
                                    </Select>
                                    <Select
                                        label="Minuto"
                                        value={surgeryMinute}
                                        onChange={handleSurgeryMinute}
                                    >
                                        <Option value='00'>00</Option>
                                        <Option value='15'>15</Option>
                                        <Option value='30'>30</Option>
                                        <Option value='45'>45</Option>
                                    </Select>
                                </div>
                                {appointment.surgeries.map((surgery, index) => {
                                    return (
                                        <div className='flex gap-3 py-1'>
                                            <Select label="Ojo" onChange={(val) => updateSurgery(index, 'eye', val)}>
                                                <Option value='OD'>Ojo Derecho</Option>
                                                <Option value='OI'>Ojo Izquierdo</Option>
                                                <Option value='AO'>Ambos Ojos</Option>
                                            </Select>
                                            <Input variant='outlined' label="Lente sugerido" placeholder='EyeOL' value={surgery.intraocular_lens} onChange={(e) => updateSurgery(index, 'intraocular_lens', e.target.value)} />
                                            <div className='flex'>
                                                <Select
                                                    label="Cirugias"
                                                    onChange={(val) => updateSurgery(index, 'surgery_id', val)}
                                                >
                                                    {
                                                        surgeries.map(surgery => {
                                                            return (
                                                                <Option key={surgery.id} value={surgery.id}>{surgery.name}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                            <IconButton variant="text" onClick={() => removeSurgery(index)} className='px-3' >
                                                <XMarkIcon className="h-6 w-6 text-red-500" />
                                            </IconButton>
                                        </div>
                                    )
                                })}
                                <div className='flex justify-center my-3'>
                                    <IconButton onClick={addSurgery} variant='outlined'>
                                        <PlusIcon className="h-5 w-5" />
                                    </IconButton>
                                </div>
                                <div className='flex pb-3'>
                                    <Select
                                        label="Cirujano"
                                        onChange={handleSurgeon}
                                    >
                                        {
                                            doctors.map(doc => {
                                                return (
                                                    <Option key={doc.id} value={doc.id.toString()}>{doc.name}</Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                                
                                <div className='flex'>
                                    <Textarea
                                        variant='outlined'
                                        label='Observaciones'
                                        value={
                                            user.role == "Administracion" || user.role == "Admin" ?
                                                appointment.admin_notes
                                                :
                                                appointment.nurse_notes
                                        }
                                        onChange={handleNotes}
                                    />
                                </div>
                            </div>
                        </div>
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