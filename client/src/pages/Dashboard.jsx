import { React, useState, useEffect } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { Card, Input } from "@material-tailwind/react";
import DatePicker from "../components/DatePicker";
import PatientCard from "../components/dashboard/PatientCard";
import useAppointmentsStore from "../store/useAppointmentsStore";
import useAppointmentStore from "../store/useAppointmentStore";
import LoadingScreen from '../layouts/LoadingScreen';
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const [open, setOpen] = useState(0)
    const { appointments, loading, error, fetchAppointments } = useAppointmentsStore()
    const [appointmentsData, setAppointmentsData] = useState([])
    const { setSelected } = useAppointmentStore()
    const [name, setName] = useState("")
    const [surgery, setSurgery] = useState("")
    const [date, setDate] = useState("")
    const navigate = useNavigate();

    useEffect(() => { fetchAppointments() }, [])
    useEffect(() => { setAppointmentsData(appointments) }, [appointments])
    useEffect(() => {
        const lowerName = name.toLocaleLowerCase()
        const lowerSurgery = surgery.toLocaleLowerCase()

        if (name || surgery || date) {
            const appointmentsFiltered = appointments.filter(appointment => {
                const patientName = `${appointment.Patient.first_name?.toLowerCase()} ${appointment.Patient.last_name?.toLowerCase()}` || ''
                console.log(lowerName, lowerSurgery, date)
                //console.log(patientName)
                if (appointment.Surgeries && appointment.Surgeries.length > 0) console.log("CIR: ", appointment.Surgeries[0].name)


                const matchesName = lowerName === '' || patientName.includes(lowerName)
                const matchesSurgery = lowerSurgery === '' || (appointment.Surgeries.length > 0 && appointment.Surgeries[0].name.toLocaleLowerCase().includes(lowerSurgery))
                const matchesDate = date === '' || appointment.surgery_date === date?.toISOString().split('T')[0]

                console.log(matchesName, matchesSurgery, matchesDate, "\n")
                return matchesName && matchesSurgery && matchesDate
            })

            setAppointmentsData(appointmentsFiltered)

        } else setAppointmentsData(appointments)

    }, [name, surgery, date])

    useEffect(() => {
        console.log("TURNOS: ", appointmentsData)
    }, [appointmentsData])

    const handleOpen = (value) => setOpen(open === value ? 0 : value)
    const handleName = (e) => setName(e.target.value)
    const handleSurgery = (e) => setSurgery(e.target.value)

    const editAppointment = (id_appointment, id_patient) => {
        setSelected({ appointmentId: id_appointment, patientId: id_patient })
        navigate('/appointment-edit')
    }

    if (loading) return <LoadingScreen loadingMenssage='Cargando turnos...' />
    if (error) return <p>Error: {error}</p>

    return (
        <SidebarLayout>
            <HeaderLayout>
                <Card className='flex flex-col w-full'>
                    <Card className='p-4 flex flex-row gap-4'>
                        <Input variant="outlined" label="Nombre o DNI" placeholder="Juan Perez" value={name} onChange={handleName} />
                        <Input variant="outlined" label="Cirugia" placeholder="Cataratas" value={surgery} onChange={handleSurgery} />
                        {/* <Input variant="outlined" label="Medico" placeholder="Dr." /> */}
                        <DatePicker title="Fecha" date={date} setDate={setDate} />
                    </Card>
                    <Card className='pt-4 px-4 my-3 h-full'>
                        {appointmentsData.map((appointment) => {
                            return (
                                <PatientCard
                                    key={appointment.id}
                                    openNumber={appointment.id}
                                    openStatus={open} handleOpenStatus={handleOpen}
                                    appointment={appointment}
                                    editAppointment={editAppointment}
                                />
                            )
                        })}
                    </Card>
                </Card>
            </HeaderLayout>
        </SidebarLayout>
    );
};

export default Dashboard;