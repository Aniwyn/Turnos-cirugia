import { useState, useEffect } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { Card, Input } from "@material-tailwind/react";
import DatePicker from "../components/DatePicker";
import PatientCard from "../components/dashboard/PatientCard";
import useSuccessAppointmentsStore from "../store/useSuccessAppointmentsStore";
import useAppointmentStore from "../store/useAppointmentStore";
import LoadingScreen from '../layouts/LoadingScreen';
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog';
import { confirmSuccessAppointment } from "../services/api"

const DashboardSuccess = () => {
    const [open, setOpen] = useState(0)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
    const [appointmentsData, setAppointmentsData] = useState([])
    const [nameDni, setNameDni] = useState("")
    const [surgery, setSurgery] = useState("")
    const [date, setDate] = useState("")
    const [appointmentId, setAppointmentId] = useState()
    const { successAppointments, loading, error, fetchAppointments } = useSuccessAppointmentsStore()
    const { setSelected } = useAppointmentStore()
    const navigate = useNavigate()

    useEffect(() => { fetchAppointments() }, [])
    useEffect(() => { setAppointmentsData(successAppointments) }, [successAppointments])
    useEffect(() => {
        const lowerName = nameDni.toLocaleLowerCase()
        const lowerSurgery = surgery.toLocaleLowerCase()

        if (nameDni || surgery || date) {
            const appointmentsFiltered = successAppointments.filter(appointment => {
                const patientName = `${appointment.Patient.first_name?.toLowerCase() || ''} ${appointment.Patient.last_name?.toLowerCase() || ''}`.trim()

                const matchesNameOrDni = lowerName === '' || patientName.includes(lowerName) || appointment.Patient.dni.includes(nameDni)
                const matchesSurgery = lowerSurgery === '' || (appointment.Surgeries.length > 0 && appointment.Surgeries[0].name.toLocaleLowerCase().includes(lowerSurgery))
                const matchesDate = date === '' || appointment.surgery_date === date?.toISOString().split('T')[0]

                console.log(matchesNameOrDni, matchesSurgery, matchesDate)
                return matchesNameOrDni && matchesSurgery && matchesDate
            })

            setAppointmentsData(appointmentsFiltered)

        } else setAppointmentsData(successAppointments)

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
    )
}

export default DashboardSuccess