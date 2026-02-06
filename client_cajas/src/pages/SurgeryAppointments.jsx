import { useEffect, useState } from 'react'
import { Accordion, AccordionItem, Chip, Card, CardBody, Divider, Avatar, User } from "@heroui/react"
import {
    Calendar,
    Clock,
    Stethoscope,
    UserRound,
    Phone,
    Mail,
    IdCard,
    FileText,
    Activity
} from 'lucide-react'
import SearchBar from "../components/surgeryAppointments/SearchBar"
import useSurgeryAppointmentStore from '../store/useSurgeryAppointmentStore'

const SurgeryAppointments = () => {
    const [queryTerms, setQueryTerms] = useState({})
    const { appointments, fetchPaginatedAppointments } = useSurgeryAppointmentStore()

    useEffect(() => {
        fetchPaginatedAppointments()
    }, [])

    useEffect(() => {
        if (appointments.length > 0) console.log(appointments)
    }, [appointments])

    const handleFilters = (name, value) => {
        // setQueryTerms(prev => {
        //     const updated = { ...prev }

        //     if (value === "") { delete updated[name] }
        //     else { updated[name] = value }

        //     return updated
        // })
    }

    const handleSearch = () => {
        // fetchPatientsFiltered(queryTerms)
    }

    // Mock data based on user example
    const appointment = {
        id: "1",
        patient: "TIANO, JONATHAN ALEXIS JONATHAN ALEXIS",
        os: "PAMI",
        date: "28/01/2026",
        time: "10:30",
        admStatus: "Apto Administrativo",
        enfStatus: "Apto Enfermería",
        surgeries: [
            { eye: "OD", procedure: "Catarata", lens: "LIO +21.0 AUROFLEX" },
            { eye: "OI", procedure: "Recubrimiento Conjuntival con Membrana A." }
        ],
        contact: {
            medic: "Dr. Jure",
            surgeon: "Dr. Lucas",
            phone1: "12345678",
            phone2: "87654321",
            email: "ASD@ASD.ASD"
        },
        admin: {
            receivedBy: "Norma",
            status: "Apto Administrativo",
            observations: [
                { date: "10/1/26 11:40 - Norma", text: "Paciente presentó toda la documentación requerida para la cirugía. Autorización confirmada." },
                { date: "10/1/26 - Judith", text: "Paciente presentó toda la documentación requerida para la cirugía. Autorización confirmada. Paciente presentó toda la documentación requerida para la cirugía. Autorización confirmada. Paciente presentó toda la documentación requerida para la cirugía. Autorización confirmada." },
                { date: "10/1/26 - Rocio", text: "Paciente presentó toda la documentación requerida para la cirugía. Autorización confirmada." }
            ]
        },
        nursing: {
            receivedBy: "Sara",
            status: "Apto Enfermería",
            observations: [
                { date: "10/1/26", text: "Evaluación pre-quirúrgica completa. Electrocardiograma normal. Apto para procedimiento." }
            ]
        }
    }

    const getStatusColor = (status) => {
        if (!status) return "default"
        switch (status) {
            case "Pendiente": return "default"
            case "Instruido": return "primary"
            case "Estudios pendientes": return "warning"
            case "Apto enfermería": return "success"
            case "Pago Incompleto": return "warning"
            case "Docs Incompletos": return "warning"
            case "Completa pago día cirugía": return "warning"
            case "Apto Administrativo": return "success"
            case "Autorizado Sin Cargo": return "success"
            case "Rechazado": return "danger"
            default: return "default"
        }
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">cosito de lugar</h1>
                <SearchBar queryTerms={queryTerms} handleFilters={handleFilters} handleSearch={handleSearch} />
            </div>

            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg border border-gray-100">
                <div className="col-span-4">Paciente / Obra Social</div>
                <div className="col-span-3">Fecha y Hora</div>
                <div className="col-span-3">Procedimientos</div>
                <div className="col-span-2 text-right">Estados</div>
            </div>

            <Accordion
                variant="splitted"
                className="px-0"
                itemClasses={{
                    base: "group bg-white border border-gray-200 shadow-sm rounded-xl data-[open=true]:border-primary-200 data-[open=true]:shadow-md transition-all",
                    title: "text-base",
                    trigger: "py-4",
                    indicator: "text-gray-400 group-data-[open=true]:text-primary-500",
                    content: "pb-6 pt-0"
                }}
            >
                <AccordionItem
                    key="1"
                    aria-label="Turno Cirugía"
                    title={
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full">
                            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                <Avatar
                                    name={appointment.patient}
                                    className="w-10 h-10 text-sm font-bold text-primary-700 bg-primary-50"
                                    getInitials={(name) => name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-gray-900 truncate">{appointment.patient}</span>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                        {appointment.os}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 flex flex-row md:flex-col gap-3 md:gap-1">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className="text-sm font-medium">{appointment.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock size={14} className="text-gray-400" />
                                    <span className="text-sm font-medium">{appointment.time} h</span>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-4 flex flex-wrap gap-2">
                                {appointment.surgeries.map((s, i) => (
                                    <div className='flex items-center gap-1'>
                                        <Chip
                                            key={i}
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            className="h-6 text-xs bg-blue-50 text-blue-700 border-blue-100"
                                        >
                                            <span className="font-mono font-xl font-bold">{s.eye}</span>
                                        </Chip>
                                        <div className='flex flex-col'>
                                            <span >{s.procedure}</span>
                                            <span className='text-xs'>{s.lens}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-1 md:col-span-1 flex flex-row md:flex-col gap-2 justify-end md:items-end">
                                <Chip
                                    size="sm"
                                    variant="dot"
                                    color={getStatusColor(appointment.admStatus)}
                                    className="border-none bg-transparent p-0 h-auto gap-2"
                                    classNames={{ dot: "w-2 h-2" }}
                                >
                                    <span className="text-xs font-medium text-gray-600">ADM</span>
                                </Chip>
                                <Chip
                                    size="sm"
                                    variant="dot"
                                    color={getStatusColor(appointment.enfStatus)}
                                    className="border-none bg-transparent p-0 h-auto gap-2"
                                    classNames={{ dot: "w-2 h-2" }}
                                >
                                    <span className="text-xs font-medium text-gray-600">ENF</span>
                                </Chip>
                            </div>
                        </div>
                    }
                >
                    <div className="px-2">
                        <Divider className="my-2 bg-gray-100" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
                            <InfoCard
                                icon={<Stethoscope size={18} />}
                                label="Médico Derivante"
                                value={appointment.contact.medic}
                            />
                            <InfoCard
                                icon={<UserRound size={18} />}
                                label="Cirujano"
                                value={appointment.contact.surgeon}
                            />
                            <InfoCard
                                icon={<Phone size={18} />}
                                label="Teléfono 1"
                                value={
                                    <div className="flex flex-col">
                                        <span>{appointment.contact.phone1}</span>
                                    </div>
                                }
                            />
                            <InfoCard
                                icon={<Phone size={18} />}
                                label="Teléfono 2"
                                value={
                                    <div className="flex flex-col">
                                        <span>{appointment.contact.phone2}</span>
                                    </div>
                                }
                            />
                            <InfoCard
                                icon={<Mail size={18} />}
                                label="Email"
                                value={appointment.contact.email}
                                className="truncate"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <StatusCard
                                title="Administración"
                                icon={<FileText size={20} />}
                                data={appointment.admin}
                                type="admin"
                            />
                            <StatusCard
                                title="Enfermería"
                                icon={<Activity size={20} />}
                                data={appointment.nursing}
                                type="nursing"
                            />
                        </div>
                    </div>
                </AccordionItem>

                {appointments && Array.isArray(appointments) && appointments.length > 0 && appointments.map((appointment, i) => (
                    <AccordionItem
                        key={appointment.id}
                        aria-label="Turno Cirugía"
                        title={
                            <div className=" relative grid grid-cols-1 md:grid-cols-12 gap-4 items-center w-full">
                                <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                    <Avatar
                                        name={`${appointment.Patient.last_name}, ${appointment.Patient.first_name}`}
                                        className="w-10 h-10 text-sm font-bold text-primary-700 bg-primary-50"
                                        getInitials={() => (appointment.Patient.last_name[0] + appointment.Patient.first_name[0])}
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-bold text-gray-900 truncate">{`${appointment.Patient.last_name}, ${appointment.Patient.first_name}`}</span>
                                        <div className='flex gap-2'>
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                                {appointment.Patient.health_insurance || "S / O.S."}
                                            </span>
                                            {!((appointment.AdministrativeStatus.name === "Apto Administrativo" || appointment.AdministrativeStatus.name === "Autorizado Sin Cargo") && appointment.MedicalStatus.name === "Apto enfermería") &&
                                                <span className="text-xs font-medium text-red-600 bg-rose-200 px-2 py-0.5 rounded-full w-fit mt-0.5">
                                                    NO APTO
                                                </span>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2 flex flex-row md:flex-col gap-3 md:gap-1">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span className="text-sm font-medium">{appointment.surgery_date || "--/--/--"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock size={14} className="text-gray-400" />
                                        <span className="text-sm font-medium">{appointment.surgery_time ? appointment.surgery_time.substring(0, 5) : "--:--"} h</span>
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-4 flex flex-wrap gap-2">
                                    {appointment.Surgeries && Array.isArray(appointment.Surgeries) && appointment.Surgeries.length > 0 && appointment.Surgeries.map((surgery) => (
                                        <div className='flex items-center gap-1' key={"002" + surgery.id}>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                className="h-6 text-xs bg-blue-50 text-blue-700 border-blue-100"
                                            >
                                                <span className="font-mono font-xl font-bold">{surgery.appointment_surgery.eye}</span>
                                            </Chip>
                                            <div className='flex flex-col'>
                                                <span >{surgery.name}</span>
                                                <span className='text-xs'>{surgery.appointment_surgery.intraocular_lens}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="col-span-1 md:col-span-1 flex flex-row md:flex-col gap-2 justify-end md:items-end">
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color={getStatusColor(appointment.AdministrativeStatus.name)}
                                        className='flex min-w-11 justify-center items-center'
                                    >
                                        <span className="text-xs font-medium">ADM</span>
                                    </Chip>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color={getStatusColor(appointment.MedicalStatus.name)}
                                        className='flex min-w-11 justify-center items-center'
                                    >
                                        <span className="text-xs font-medium w-full flex justify-center items-center">ENF</span>
                                    </Chip>
                                </div>
                            </div>
                        }
                    >
                        <div className="px-2">
                            <Divider className="my-2 bg-gray-100" />
                            <div className="flex gap-4 py-4">
                                {appointment.Patient.dni &&
                                    <InfoCard
                                        icon={<IdCard size={18} />}
                                        label="DNI"
                                        value={appointment.Patient.dni}
                                        className="truncate"
                                    />
                                }
                                {appointment.Patient.Medic.name &&
                                    <InfoCard
                                        icon={<Stethoscope size={18} />}
                                        label="Médico Derivante"
                                        value={appointment.Patient.Medic.name}
                                    />
                                }
                                {appointment.Medic?.name &&
                                    <InfoCard
                                        icon={<UserRound size={18} />}
                                        label="Cirujano"
                                        value={appointment.Medic.name}
                                    />
                                }
                                {appointment.Patient.phone1 &&
                                    <InfoCard
                                        icon={<Phone size={18} />}
                                        label="Teléfono 1"
                                        value={appointment.Patient.phone1}
                                    />
                                }
                                {appointment.Patient.phone2 &&
                                    <InfoCard
                                        icon={<Phone size={18} />}
                                        label="Teléfono 2"
                                        value={appointment.Patient.phone2}

                                    />
                                }
                            </div>

                            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <StatusCard
                                    title="Administración"
                                    icon={<FileText size={20} />}
                                    data={appointment.admin}
                                    type="admin"
                                />
                                <StatusCard
                                    title="Enfermería"
                                    icon={<Activity size={20} />}
                                    data={appointment.nursing}
                                    type="nursing"
                                />
                            </div> */}
                        </div>
                    </AccordionItem>
                ))}

            </Accordion>
        </div>
    )
}

const InfoCard = ({ icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-3 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors ${className}`}>
        <div className="mt-0.5 text-gray-400">{icon}</div>
        <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
            <div className="text-sm text-gray-900 font-medium">{value || "-"}</div>
        </div>
    </div>
)

const StatusCard = ({ title, icon, data, type }) => {
    const isSuccess = data.status.toLowerCase().includes('apto')
    const colorClass = type === 'admin' ? 'blue' : 'emerald'
    const statusColor = isSuccess ? 'success' : 'warning'

    return (
        <Card shadow="none" className={`border border-gray-200 h-full`}>
            <CardBody className="p-0">
                <div className={`px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50`}>
                    <div className="flex items-center gap-2">
                        <div className={`text-${colorClass}-600`}>{icon}</div>
                        <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
                    </div>
                    <Chip size="sm" color={statusColor} variant="flat" className="h-6">
                        {data.status}
                    </Chip>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2 mb-4 text-sm">
                        <span className="text-gray-500">Recibió:</span>
                        <User
                            name={data.receivedBy}
                            description="Personal"
                            avatarProps={{
                                size: "sm",
                                className: "w-6 h-6 text-xs"
                            }}
                            className="justify-start"
                        />
                    </div>

                    <div className="space-y-3">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Observaciones</p>
                        {data.observations.length > 0 ? (
                            data.observations.map((obs, i) => (
                                <div key={i} className="relative pl-4 border-l-2 border-gray-200 py-1 m-0">
                                    <div className="absolute -left-1.25 top-2 w-2 h-2 rounded-full bg-gray-300"></div>
                                    <span className="text-xs font-semibold text-gray-500 block mb-1">{obs.date}</span>
                                    <p className="text-sm text-gray-600 leading-relaxed">{obs.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">Sin observaciones registradas.</p>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default SurgeryAppointments