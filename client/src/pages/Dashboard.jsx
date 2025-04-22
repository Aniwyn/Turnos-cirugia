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
    const { setSelected } = useAppointmentStore()
    const [date, setDate] = useState(null)
    const navigate = useNavigate();

    useEffect(() => { fetchAppointments() }, [])

    const handleOpen = (value) => setOpen(open === value ? 0 : value)

    if (loading) return <LoadingScreen loadingMenssage='Cargando turnos...'/>
    if (error) return <p>Error: {error}</p>

    const editAppointment = (id_appointment, id_patient) => {
        setSelected({ appointmentId: id_appointment, patientId: id_patient })
        navigate('/appointment-edit')
    }

    return (
        <SidebarLayout>
            <HeaderLayout>
                <Card className='flex flex-col w-full'>
                    <Card className='p-4 flex flex-row gap-4'>
                        <Input variant="outlined" label="Nombre" placeholder="Juan Perez" />
                        <Input variant="outlined" label="Cirugia" placeholder="Cataratas" />
                        <Input variant="outlined" label="Medico" placeholder="Dr." />
                        <DatePicker title="Fecha" date={date} setDate={setDate}/>
                    </Card>
                    <Card className='p-4 my-3 h-full'>
                        {appointments.map((appointment) => (
                            <PatientCard 
                                key={appointment.id} 
                                openNumber={appointment.id} 
                                openStatus={open} handleOpenStatus={handleOpen} 
                                appointment={appointment} 
                                editAppointment={editAppointment}
                            />
                        ))}
                    </Card>
                </Card>
            </HeaderLayout>
        </SidebarLayout>
    );
};

export default Dashboard;