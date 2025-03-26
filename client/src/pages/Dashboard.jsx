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

    useEffect(() => { fetchAppointments(); }, [])

    useEffect(() => {
        console.log(appointments)
    }, [appointments])

    const handleOpen = (value) => setOpen(open === value ? 0 : value)

    // Dev code: quitar
    if (loading) return <p>Cargando turnos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <SidebarLayout>
            <HeaderLayout>
                <div className=''>
                    <Card className='p-6 flex flex-row gap-4'>
                        <Input variant="outlined" label="Nombre" placeholder="Juan Perez" />
                        <Input variant="outlined" label="DNI" placeholder="12345678" />
                        <DatePicker title="Desde" />
                        <DatePicker title="Hasta" />
                    </Card>
                    <Card className='p-8 mt-4'>
                        {appointments.map((appointment) => (
                            <li key={appointment.id}>
                                {appointment.first_name} {appointment.last_name} - {appointment.surgery_date} {appointment.surgery_time}
                            </li>
                        ))}
                        <PatientCard openNumber={1} openStatus={open} handleOpenStatus={handleOpen} />
                        <PatientCard openNumber={2} openStatus={open} handleOpenStatus={handleOpen} />
                        <PatientCard openNumber={3} openStatus={open} handleOpenStatus={handleOpen} />
                    </Card>
                </div>
            </HeaderLayout>
        </SidebarLayout>
    );
};

export default Dashboard;