import { React, useState, useEffect } from 'react'
import SidebarLayout from "../layouts/SidebarLayout"
import HeaderLayout from "../layouts/HeaderLayout"
import { Accordion, AccordionHeader, AccordionBody, Collapse, Button, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import DatePicker from "../components/DatePicker"
import AlertMessage from "../components/AlertMessage"
import { getAppointmentByDni, getMedicalStatus, getSurgeries, updateOrCreatePatient, createAppointment } from "../services/api"
import { useNavigate } from 'react-router-dom'
import useAuthStore from "../store/authStore"
import { use } from 'react'

function Icon({ id, open }) {
    return (
        <ChevronDownIcon
            className={`${id === open ? "rotate-180" : ""} h-6 w-6 text-gray-500`}
        />
    )
}

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
    admin_notes: "",
    nurse_notes: "",
    medical_status_id: null,
    admin_status_id: null,
    surgeon_id: "0",
    surgeries: [
        {eye: "", intraocular_lens: "", surgery_id: 0}
    ]
}

//modificar base de datos
const doctors = [
    { id: 1, name: 'Dr. Siufi Lucas' },
    { id: 2, name: 'Dr. Siufi Ernesto' },
    { id: 3, name: 'Dr. Abud Valeria' },
    { id: 4, name: 'Dr. Ase Veronica' },
]

const Appointment = () => {
    const [open, setOpen] = useState(1)
    const [patient, setPAtient] = useState(tmpPatient)
    const [newPatient, setNewPatient] = useState(true)
    const [appointment, setAppointment] = useState(tmpAppoiment)
    const [statuses, setStatuses] = useState([{ name: "NO", id: 0}])
    const [surgeries, setSurgeries] = useState([{ name: "NO", id: 0}])
    const [surgeryDate, setSurgeryDate] = useState(null)
    const [surgeryHour, setSurgeryHour] = useState()
    const [surgeryMinute, setSurgeryMinute] = useState()
    const [alert, setAlert] = useState({show: false})
    const navigate = useNavigate()
    const { user } = useAuthStore();

    useEffect(() => { 
        const fetchMedicalStatuses = async () => {
            const statusesFetched = await getMedicalStatus()
            setStatuses(statusesFetched)
        }
        const fetchSurgeries = async () => {
            const surgeriesFetched = await getSurgeries()
            setSurgeries(surgeriesFetched)
        }

        fetchMedicalStatuses()
        fetchSurgeries()
    }, [])

    //Manejadores de paciente
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const handleDni = (e)  => {setPAtient((prev) => ({...prev, dni: e.target.value}))}
    const handleFirsName = (e)  => {setPAtient((prev) => ({...prev, first_name: e.target.value}))}
    const handleLastName = (e)  => {setPAtient((prev) => ({...prev, last_name: e.target.value}))}
    const handlePhone1 = (e)  => {setPAtient((prev) => ({...prev, phone1: e.target.value}))}
    const handlePhone2 = (e)  => {setPAtient((prev) => ({...prev, phone2: e.target.value}))}
    const handleEmail = (e)  => {setPAtient((prev) => ({...prev, email: e.target.value}))}
    const handleHealthInsurance = (e)  => {setPAtient((prev) => ({...prev, health_insurance: e.target.value}))}
    const handleDoctor = (val)  => {setPAtient((prev) => ({...prev, doctor_id: val}))}

    //Manejadores de turno
    const handleNotes = (e) => {
        if (user.role == "Administracion" || user.role == "Admin") {
            setAppointment((prev) => ({...prev, admin_notes: e.target.value}))
        } else if (user.role == "Enfermeria") {
            setAppointment((prev) => ({...prev, nurse_notes: e.target.value}))
        }
    }
    const handleStatus = (val) => {
        if (user.role == "Administracion" || user.role == "Admin") {
            setAppointment((prev) => ({...prev, admin_status_id: val}))
        } else if (user.role == "Enfermeria") {
            setAppointment((prev) => ({...prev, medical_status_id: val}))
        }
    }
    const handleSurgeryHour = (val)  => {setSurgeryHour(val)}
    const handleSurgeryMinute= (val)  => {setSurgeryMinute(val)}
    const handleSurgeon = (val)  => {setAppointment((prev) => ({...prev, surgeon_id: val}))}

    const findPatient = async () => {
        const patientFetched = await getAppointmentByDni(patient.dni)
        if (patientFetched) {
            setPAtient(patientFetched)
            setNewPatient(false)
        } else {
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
            surgeries: [...prev.surgeries, {eye: "", intraocular_lens: "", surgery_id: 0}]
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

    const handleNext = () => {
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

            const appointmentJSON = {
                patient_id: patientDB.patient_id,
                admin_notes: appointment.admin_notes == "" ? null : appointment.admin_notes,
                nurse_notes: appointment.nurse_notes == "" ? null : appointment.nurse_notes,
                surgery_date: surgeryDate.toISOString().split('T')[0],
                surgery_time: `${surgeryHour.padStart(2, '0')}:${surgeryMinute.padStart(2, '0')}:00`,
                surgeon_id: appointment.surgeon_id == 0 ? null : Number(appointment.surgeon_id),
                //CAMBIAR ESTO ABAJO, DEBER appointment.admin_status_id == 0 ? null : Number(appointment.admin_status_id),
                admin_status_id: appointment.admin_status_id ? Number(appointment.admin_status_id) : 0,
                medical_status_id: appointment.medical_status_id ? Number(appointment.medical_status_id): 0,
                surgeries: appointment.surgeries
            }
            const appointmentDB = await createAppointment(appointmentJSON)

            navigate('/')
        }

        handleNextAsync()
    }

    return(
        <SidebarLayout>
            <HeaderLayout>
            {alert.show && (
                <AlertMessage message="¡Operación exitosa!" type="success" alert={alert} setAlert={setAlert}/>
            )}
                <div className='flex'>
                    <div className='mx-40 my-6 rounded-lg bg-gray-200'>
                        <Typography variant='h3' className='text-center'> Registrar turno</Typography>
                        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(1)} className='border-b-0 p-0'> {/*pb-0*/}
                                Paciente
                            </AccordionHeader>
                            <AccordionBody className='pb-5'>
                                <div className='flex mx-auto'>
                                    <div className='flex'>
                                        <Input variant='outlined' label="DNI" placeholder='12345678' value={patient.dni} onChange={handleDni} className='max-w-[200px]' disabled={!newPatient} />
                                        <Button onClick={findPatient} className='w-full' disabled={!newPatient}>Buscar</Button>
                                    </div>
                                    <Select 
                                        label="Médico"
                                        value={patient.doctor}
                                        onChange={handleDoctor}
                                    >
                                        {
                                            doctors.map(doc => {return(
                                                <Option key={doc.id} value={doc.id}>{doc.name}</Option>
                                            )})
                                        }
                                    </Select>
                                </div>
                                <Collapse open={true}>
                                    <div className='flex'>
                                        <Input variant='outlined' label="Nombre/s" placeholder='Perez' value={patient.first_name} onChange={handleFirsName}/>
                                        <Input variant='outlined' label="Apellido/s" placeholder='Juan Pablo' value={patient.last_name} onChange={handleLastName}/>
                                    </div>
                                    <div className='flex'>
                                        <Input variant='outlined' label="Tel 1" placeholder='3881234567' value={patient.phone1} onChange={handlePhone1}/>
                                        <Input variant='outlined' label="Tel 2" placeholder='3881234567' value={patient.phone2} onChange={handlePhone2}/>
                                    </div>
                                    <div className='flex'>
                                        <Input variant='outlined' label='Email' placeholder='correo@gmail.com' value={patient.email} onChange={handleEmail}/>
                                        <Input variant='outlined' label="Obra social" placeholder='PAMI' value={patient.health_insurance} onChange={handleHealthInsurance}/>
                                    </div>
                                </Collapse>
                            </AccordionBody>
                        </Accordion>
                        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(2)} className='border-b-0 p-0'> {/*pb-0*/}
                                Turno
                            </AccordionHeader>
                            <AccordionBody className='pb-5'>
                                <div className='flex'>
                                    <Select
                                        label="Estado"
                                        onChange={handleStatus}
                                    >
                                        {
                                            statuses.map(status => {return(
                                                <Option key={status.id} value={status.id.toString()}>{status.name}</Option>
                                            )})
                                        }
                                    </Select>
                                </div>
                                {appointment.surgeries.map((surgery, index) => {
                                    return(
                                    <div key={index} className='flex'>
                                        <Select label="Ojo" onChange={(val) => updateSurgery(index, 'eye', val)}>
                                            <Option value='OD'>Ojo Derecho</Option>
                                            <Option value='OI'>Ojo Izquierdo</Option>
                                            <Option value='AO'>Ambos Ojos</Option>
                                        </Select>
                                        <Input variant='outlined' label="Lente sugerido" placeholder='Cataratas' value={surgery.intraocular_lens} onChange={(e)  => updateSurgery(index, 'intraocular_lens', e.target.value)}/>
                                        <div className='flex'>
                                            <Select 
                                                label="Cirugias"
                                                onChange={(val) => updateSurgery(index, 'surgery_id', val)}
                                            >
                                                {
                                                    surgeries.map(surgery => {return(
                                                        <Option key={surgery.id} value={surgery.id}>{surgery.name}</Option>
                                                    )})
                                                }
                                            </Select>
                                        </div>
                                        <Button onClick={() => removeSurgery(index)}>Borrar</Button>
                                    </div>
                                    )
                                })}
                                <Button onClick={addSurgery}>+</Button>
                                <div className='flex'>
                                    <Select 
                                        label="Cirujano"
                                        onChange={handleSurgeon}
                                    >
                                        {
                                            doctors.map(doc => {return(
                                                <Option key={doc.id} value={doc.id.toString()}>{doc.name}</Option>
                                            )})
                                        }
                                    </Select>
                                </div>
                                <div className='flex'>
                                    <DatePicker title="Fecha" date={surgeryDate} setDate={setSurgeryDate} />
                                    <Select
                                        label="Hora"
                                        value={surgeryHour || 1}
                                        onChange={handleSurgeryHour}
                                    >
                                        <Option value='9'>9</Option>
                                        <Option value='10'>10</Option>
                                        <Option value='11'>11</Option>
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
                                <div className='flex'>
                                    <Textarea variant='outlined' label='Observaciones' value={appointment.nurse_notes} onChange={handleNotes}/>
                                </div>
                            </AccordionBody>
                        </Accordion>
                        <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(3)} className='border-b-0 p-0'> {/*pb-0*/}
                                Revisión
                            </AccordionHeader>
                            <AccordionBody className='pb-5'>
                                datos paciente
                            </AccordionBody>
                        </Accordion>
                    </div>
                    <div>
                        <Button onClick={handleNext}>Siguiente</Button>
                        <Button>Cancelar</Button>
                    </div>
                </div>
            </HeaderLayout>
        </SidebarLayout>
    )
}

export default Appointment