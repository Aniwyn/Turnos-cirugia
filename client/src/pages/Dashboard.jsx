import { React, useState, useEffect } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { Card, Input } from "@material-tailwind/react";
import DatePicker from "../components/DatePicker";
import PatientCard from "../components/PatientCard";
import useAppointmentsStore from "../store/useAppointmentsStore";

const Dashboard = () => {
    const [open, setOpen] = useState(0)
    const { appointments, loading, error, fetchAppointments } = useAppointmentsStore()
    const [date, setDate] = useState(null)

    useEffect(() => { fetchAppointments(); }, [])

    const handleOpen = (value) => setOpen(open === value ? 0 : value)

    // Dev code: mejorar o quitar
    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p>Error: {error}</p>;

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
                            <PatientCard key={appointment.id} openNumber={appointment.id} openStatus={open} handleOpenStatus={handleOpen} appointment={appointment}/>
                        ))}
                    </Card>
                </Card>
            </HeaderLayout>
        </SidebarLayout>
    );
};

export default Dashboard;