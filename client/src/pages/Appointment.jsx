import { React, useState, useEffect } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { Accordion, AccordionHeader, AccordionBody, Collapse, Button, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import DatePicker from "../components/DatePicker";
import { getAppointmentByDni, getMedicalStatus, getSurgeries } from "../services/api";

function Icon({ id, open }) {
    return (
        <ChevronDownIcon
            className={`${id === open ? "rotate-180" : ""} h-6 w-6 text-gray-500`}
        />
    )
}

const tmpPatient = {
    id: null,
    fist_name: "",
    last_name: "",
    doctor: null,
    phone1: "",
    phone2: "",
    email: "",
    dni: "",
    health_insurance: ""
}

//separar relaciones anidadas
const tmpAppoiment = {
    admin_notes: "",
    nurse_notes: "",
    MedicalStatus: { id: 1 },
    Surgery: [
        {appointment_surgery: {
            intraocular_lens: ""
        }}
    ]
}

const Appointment = () => {
    const [open, setOpen] = useState(2)
    const [patient, setPAtient] = useState(tmpPatient)
    const [newPatient, setNewPatient] = useState(true)
    const [appointment, setAppointment] = useState(tmpAppoiment)
    const [statuses, setStatuses] = useState([{ name: "NO", id: 0}])
    const [surgeries, setSurgeries] = useState([{ name: "NO", id: 0}])
    const [date, setDate] = useState(null)
    const [hour, setHour] = useState("")
    const [minute, setMinute] = useState("")

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
    const handleDoctor = (val)  => {setPAtient((prev) => ({...prev, doctor: val}))}

    //Manejadores de turno
    const handleAdminNotes = (e)  => {setAppointment((prev) => ({...prev, admin_notes: e.target.value}))}
    const handleNurseNotes = (e)  => {setAppointment((prev) => ({...prev, nurse_notes: e.target.value}))}
    const handleMedicalStatus = (val)  => {setAppointment((prev) => ({...prev, MedicalStatus: { id : val}}))}
    const handleHour = (val)  => {setHour(val)}
    const handleMinute= (val)  => {setMinute(val)}
    const handleLens = (e)  => {setAppointment((prev) => ({...prev, Surgery: [{appointment_surgery: { intraocular_lens: e.target.value}}] }))}
    
    //modificar base de datos
    const doctors = [
        { id: 1, name: 'Dr. Siufi Lucas' },
        { id: 2, name: 'Dr. Siufi Ernesto' },
        { id: 3, name: 'Dr. Abud Valeria' },
        { id: 4, name: 'Dr. Ase Veronica' },
    ]

    const findPatient = async () => {
        const patientFetched = await getAppointmentByDni(patient.dni)
        if (patientFetched) {
            setPAtient(patientFetched)
            setNewPatient(false)
        }
    }

    const handleNext = () => {
        const handleNextAsync = async () => {
            const patientJSON = {
                dni: patient.id,
                first_name: patient.fist_name,
                last_name: patient.last_name,
                phone1: patient.phone1,
                phone2: patient.phone2,
                email: patient.email,
                health_insurance: patient.health_insurance,
                doctor_id: patient.doctor,
            }
    
            const asd = await "asd(patientJSON)"

            const appointmentJSON = {
                patientId: asd,
                adminNotes: appointment.admin_notes,
                nurseNotes: appointment.nurse_notes,
                surgeryDate: ,
                surgeryTime: ,
                surgeonId: ,
                adminStatusId: ,
                medicalStatusId: 
            }


        }
        handleNextAsync()
    }

    return(
        <SidebarLayout>
            <HeaderLayout>
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
                                        value={appointment.MedicalStatus.id || 1}
                                        onChange={handleMedicalStatus}
                                    >
                                        {
                                            statuses.map(status => {return(
                                                <Option key={status.id}>{status.name}</Option>
                                            )})
                                        }
                                    </Select>
                                </div>
                                <div className='flex'>
                                    <Select label="Ojo">
                                        <Option value='OD'>Ojo Derecho</Option>
                                        <Option value='OI'>Ojo Izquierdo</Option>
                                        <Option value='AO'>Ambos Ojos</Option>
                                    </Select>
                                    <Input variant='outlined' label="Lente sugerido" placeholder='Cataratas' value={appointment.Surgery[0].appointment_surgery.intraocular_lens} onChange={handleLens}/>
                                    <div className='flex'>
                                        <Select label="Cirugias">
                                            {
                                                surgeries.map(surgery => {return(
                                                    <Option key={surgery.id} value={surgery.id}>{surgery.name}</Option>
                                                )})
                                            }
                                        </Select>
                                    </div>
                                </div>
                                {/* tengo este fragmento de codigo pero como sabes necesito poder cargar 1 o mas cirugias, como deberia ser la logica para poder hacerlo?*/}
                                <div className='flex'>
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
                                <div className='flex'>
                                    <DatePicker title="Fecha" date={date} setDate={setDate} />
                                    <Select
                                        label="Hora"
                                        value={hour}
                                        onChange={handleHour}
                                    >
                                        <Option>9</Option>
                                        <Option>10</Option>
                                        <Option>11</Option>
                                    </Select>
                                    <Select
                                        label="Minuto"
                                        value={minute}
                                        onChange={handleMinute}
                                    >
                                        <Option>00</Option>
                                        <Option>15</Option>
                                        <Option>30</Option>
                                        <Option>45</Option>
                                    </Select>
                                </div>
                                <div className='flex'>
                                    <Textarea variant='outlined' label='Observaciones' value={appointment.nurse_notes} onChange={handleNurseNotes}/>
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
                        <Button>Siguiente</Button>
                        <Button>Cancelar</Button>
                    </div>
                </div>
            </HeaderLayout>
        </SidebarLayout>
    )
}

export default Appointment