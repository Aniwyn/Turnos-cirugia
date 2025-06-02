import React from 'react'
import { Typography } from "@material-tailwind/react"
import { format } from "date-fns"

const MainRow = ({ appointment, openStatus, openNumber }) => {
    return (
        <div className='grid grid-cols-12 flex-row justify-between w-full'>
            <div className='col-span-6 flex'>
                <Typography className={`content-center transition-colors ${openStatus === openNumber ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent" : ""}`} variant="h6">
                    {`${appointment.Patient.last_name}, ${appointment.Patient.first_name}`}
                </Typography>
                <Typography className='content-center ps-4' variant="paragraph">
                    {appointment.Patient.health_insurance}
                </Typography>
            </div>
            <div className='col-span-3 flex'>
                <Typography className={'content-center transition-colors font-bold'} variant="paragraph">
                    Fecha:
                </Typography>
                <Typography className='content-center ps-1' variant="paragraph">
                    {appointment.surgery_date ? format(new Date(appointment.surgery_date + 'T00:00:00'), "dd/MM/yyyy") : "s/f"}
                </Typography>
            </div>
            <div className='col-span-2 flex'>
                <Typography className={'content-center transition-colors font-bold'} variant="paragraph">
                    Hora:
                </Typography>
                <Typography className='content-center ps-1' variant="paragraph">
                    {appointment.surgery_time ? format(new Date(`1970-01-01T${appointment.surgery_time}`), "HH:mm") : "s/h"}
                </Typography>
            </div>
            <div className='flex flex-col pe-5'>
                <div className='flex justify-between'>
                    <Typography className='text-xs'>ADM: </Typography>
                    <div className="flex w-4 h-4 items-center justify-center">
                        <div
                            className="h-2 w-2 rounded-full ring-2 shadow-sm"
                            style={{
                                backgroundColor: appointment.AdministrativeStatus.color,
                                ringColor: `${appointment.AdministrativeStatus.color}50`,
                                boxShadow: `0px 0px 5px ${appointment.AdministrativeStatus.color}`,
                            }}
                        ></div>
                    </div>
                </div>
                <div className='flex justify-between'>
                    <Typography className='text-xs'>ENF: </Typography>
                    <div className="flex w-4 h-4 items-center justify-center">
                        <div
                            className="h-2 w-2 rounded-full ring-2 shadow-sm"
                            style={{
                                backgroundColor: appointment.MedicalStatus.color,
                                ringColor: `${appointment.MedicalStatus.color}50`,
                                boxShadow: `0px 0px 5px ${appointment.MedicalStatus.color}`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainRow