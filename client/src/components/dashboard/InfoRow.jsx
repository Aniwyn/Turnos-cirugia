import React from 'react'
import { Typography } from "@material-tailwind/react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"

const InfoRow = ({ appointment, editAppointment }) => {
    return (
        <div className='flex flex-row justify-start'>
            {
                appointment.Patient.Medic?.name
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Médico:</Typography>
                        <Typography className='content-center ps-1' variant="small">{appointment.Patient.Medic?.name}</Typography>
                    </>
                    : ""
            }
            {
                appointment.Medic?.name
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Cirujano:</Typography>
                        <Typography className='content-center ps-1' variant="small">{appointment.Medic?.name}</Typography>
                    </>
                    : ""
            }
            {
                appointment.Patient.phone1
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Tel 1:</Typography>
                        <Typography className='content-center ps-1' variant="small">{appointment.Patient.phone1}</Typography>
                    </>
                    : ""
            }
            {
                appointment.Patient.phone2
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Tel 2:</Typography>
                        <Typography className='content-center ps-1' variant="small">{appointment.Patient.phone2}</Typography>
                    </>
                    : ""
            }
            {
                appointment.Patient.email
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Email:</Typography>
                        <Typography className='content-center ps-1' variant="small">{appointment.Patient.email}</Typography>
                    </>
                    : ""
            }
            <div className='flex flex-row ms-auto me-10'>
                <PencilSquareIcon className="h-6 w-6 text-orange-700 mx-2 cursor-pointer" onClick={() => editAppointment(appointment.id, appointment.patient_id)} />
            </div>
        </div>
    )
}

export default InfoRow