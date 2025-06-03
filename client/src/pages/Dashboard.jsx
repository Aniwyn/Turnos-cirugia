import { useState, useEffect } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { Card, Input, IconButton } from "@material-tailwind/react";
import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import DatePicker from "../components/DatePicker";
import PatientCard from "../components/dashboard/PatientCard";
import useAppointmentsStore from "../store/useAppointmentsStore";
import useAppointmentStore from "../store/useAppointmentStore";
import LoadingScreen from '../layouts/LoadingScreen';
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog';
import { confirmSuccessAppointment } from "../services/api"
import { exportAppointmentsToExcel } from '../utils/exportXLS'

const Dashboard = () => {
    const [open, setOpen] = useState(0)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [appointmentsData, setAppointmentsData] = useState([])
    const [nameDni, setNameDni] = useState("")
    const [surgery, setSurgery] = useState("")
    const [date, setDate] = useState("")
    const [appointmentId, setAppointmentId] = useState()
    const { appointments, loading, error, fetchAppointments } = useAppointmentsStore()
    const { setSelected } = useAppointmentStore()
    const navigate = useNavigate()

    useEffect(() => { fetchAppointments() }, [])
    useEffect(() => { setAppointmentsData(appointments) }, [appointments])
    useEffect(() => {
        const lowerName = nameDni.toLocaleLowerCase()
        const lowerSurgery = surgery.toLocaleLowerCase()

        if (nameDni || surgery || date) {
            const appointmentsFiltered = appointments.filter(appointment => {
                const patientName = `${appointment.Patient.first_name?.toLowerCase()} ${appointment.Patient.last_name?.toLowerCase()}` || ''

                const matchesNameOrDni = lowerName === '' || patientName.includes(lowerName) || appointment.Patient.dni.includes(nameDni)
                const matchesSurgery = lowerSurgery === '' || (appointment.Surgeries.length > 0 && appointment.Surgeries[0].name.toLocaleLowerCase().includes(lowerSurgery))
                const matchesDate = date === '' || date === undefined || appointment.surgery_date === date?.toISOString().split('T')[0]

                return matchesNameOrDni && matchesSurgery && matchesDate
            })
            setAppointmentsData(appointmentsFiltered)

        } else setAppointmentsData(appointments)

    }, [nameDni, surgery, date])

    const handleOpen = (value) => setOpen(open === value ? 0 : value)
    const handleNameDni = (e) => setNameDni(e.target.value)
    const handleSurgery = (e) => setSurgery(e.target.value)

    const editAppointment = (id_appointment, id_patient) => {
        setSelected({ appointmentId: id_appointment, patientId: id_patient })
        navigate('/appointment-edit')
    }

    const confirmSurgery = async () => {
        await confirmSuccessAppointment(appointmentId)
        fetchAppointments()
    }

    const openButtonDialog = (id) => {
        setAppointmentId(id)
        setOpenConfirmDialog(true)
    }

    const exportToExcel = () => {
        exportAppointmentsToExcel(appointmentsData)
    }

    if (loading) return <LoadingScreen loadingMenssage='Cargando turnos...' />
    if (error) return <p>Error: {error}</p>

    return (
        <SidebarLayout>
            <HeaderLayout>
                <ConfirmDialog 
                    open={openConfirmDialog} 
                    setOpen={setOpenConfirmDialog}
                    title="Confirmar ciruagía"
                    subTitle="¿Estas seguro que quieres confirmar la cirugía como realizada? Este proceso no es reversible"
                    confirmFunction={confirmSurgery}
                />
                <Card className='flex flex-col w-full'>
                    <Card className='p-4 flex flex-row gap-4'>
                        <Input variant="outlined" label="Nombre o DNI" placeholder="Juan Perez" value={nameDni} onChange={handleNameDni} />
                        <Input variant="outlined" label="Cirugia" placeholder="Cataratas" value={surgery} onChange={handleSurgery} />
                        <DatePicker title="Fecha" date={date} setDate={setDate} />
                        <IconButton size="lg" className='min-w-10 h-10 hover:shadow-[#55FF55]/10' color='green' onClick={exportToExcel}>
                            <DocumentChartBarIcon className="h-5 w-5 text-white" />
                        </IconButton>
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
                                    openButtonDialog={openButtonDialog}
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