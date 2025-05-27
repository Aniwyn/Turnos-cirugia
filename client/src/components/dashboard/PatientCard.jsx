import { Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import MainRow from './MainRow'
import InfoRow from './InfoRow'
import SurgeryItem from './SurgeryItem'
import UserState from './UserState'

function Icon({ id, open }) {
    return (
        <ChevronDownIcon
            className={`${id === open ? "rotate-180" : ""} h-6 w-6 text-gray-500`}
        />
    )
}

const PatientCard = ({ openNumber, openStatus, handleOpenStatus, appointment, editAppointment, openButtonDialog }) => {
    return(
        <Accordion open={openStatus === openNumber} icon={<Icon id={openNumber} open={openStatus} />}>
            <AccordionHeader onClick={() => handleOpenStatus(openNumber)} className='border-b-0 p-0'>
                <div className='flex flex-col w-full'>
                    <MainRow 
                        appointment={appointment}
                        openStatus={openStatus}
                        openNumber={openNumber}
                    />
                    {
                        appointment.Surgeries.map((surgery, n) => {
                            return(
                                <SurgeryItem key={surgery.appointment_surgery.id} surgery={surgery}/>
                            )
                        })
                    }
                </div>
            </AccordionHeader>
            <AccordionBody className='pb-5'>
                <div className='flex flex-col'>
                    <InfoRow
                        appointment={appointment}
                        editAppointment={editAppointment}
                        openButtonDialog={openButtonDialog}
                    />
                    <div className='flex flex-row w-full'>
                        <div className='pt-2 w-[45%]'>
                            <UserState
                                title="Administración"
                                userName={appointment.AdminUser?.name}
                                status={appointment.AdministrativeStatus}
                                note={appointment.admin_notes}
                            />
                        </div>
                        <div className='pt-2'>
                            <UserState
                                title="Enfermería"
                                userName={appointment.MedicalUser?.name}
                                status={appointment.MedicalStatus}
                                note={appointment.nurse_notes}
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full h-[2px] bg-gradient-to-r from-pink-500 to-red-500 rounded-[1px] mt-5'/>
            </AccordionBody>
        </Accordion>
    )
}

export default PatientCard