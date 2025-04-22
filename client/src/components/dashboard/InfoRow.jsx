import React from 'react'
import { Typography } from "@material-tailwind/react"
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"

const InfoRow = ({ surgeon, patient, editAppointment }) => {
    return (
        <div className='flex flex-row justify-start'>
            {
                patient.Medic?.name
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Médico:</Typography>
                        <Typography className='content-center ps-1' variant="small">{patient.Medic?.name}</Typography>
                    </>
                    : ""
            }
            {
                surgeon
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Cirujano:</Typography>
                        <Typography className='content-center ps-1' variant="small">{surgeon}</Typography>
                    </>
                    : ""
            }
            {
                patient.phone1
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Tel 1:</Typography>
                        <Typography className='content-center ps-1' variant="small">{patient.phone1}</Typography>
                    </>
                    : ""
            }
            {
                patient.phone2
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Tel 2:</Typography>
                        <Typography className='content-center ps-1' variant="small">{patient.phone2}</Typography>
                    </>
                    : ""
            }
            {
                patient.email
                    ?
                    <>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">Email:</Typography>
                        <Typography className='content-center ps-1' variant="small">{patient.email}</Typography>
                    </>
                    : ""
            }
            <div className='flex flex-row ms-auto me-10'>
                <PencilSquareIcon className="h-6 w-6 text-orange-500 mx-2 cursor-pointer" onClick={() => editAppointment(appointment.id, appointment.patient_id)} />
                <TrashIcon className="h-6 w-6 text-red-500 mx-2" />
            </div>
        </div>
    )
}

export default InfoRow