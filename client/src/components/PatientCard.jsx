import React from 'react'
import { Accordion, AccordionHeader, AccordionBody, Typography } from "@material-tailwind/react";
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";


function Icon({ id, open }) {
    return (
        <ChevronDownIcon
            className={`${id === open ? "rotate-180" : ""} h-6 w-6 text-gray-500`}
        />
    );
}

const PatientCard = ({ openNumber, openStatus, handleOpenStatus, appointment, editAppointment }) => {
    return(
        <Accordion open={openStatus === openNumber} icon={<Icon id={openNumber} open={openStatus} />}>
            <AccordionHeader onClick={() => handleOpenStatus(openNumber)} className='border-b-0 p-0'> {/*pb-0*/}
                <div className='flex flex-col w-full'>
                    {/*<div className='flex flex-row justify-between w-full'>*/}
                    <div className='grid grid-cols-12 flex-row justify-between w-full'>
                        <div className='col-span-6 flex'>
                            <Typography className={`content-center transition-colors ${ openStatus === openNumber ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent" : ""}`} variant="h5">
                                {`${appointment.Patient.last_name}, ${appointment.Patient.first_name}`}
                            </Typography>
                            <Typography className='content-center ps-4' variant="lead">
                                {appointment.Patient.health_insurance}
                            </Typography>
                        </div>
                        <div className='col-span-3 flex'>
                            <Typography className={'content-center transition-colors font-bold'} variant="lead">
                                Fecha:
                            </Typography>
                            <Typography className='content-center ps-1' variant="lead">
                                { appointment.surgery_date ? format(new Date(appointment.surgery_date), "dd/MM/yyyy") : "s/f" }
                            </Typography>
                        </div>
                        <div className='col-span-2 flex'>
                            <Typography className={'content-center transition-colors font-bold'} variant="lead">
                                Hora:
                            </Typography>
                            <Typography className='content-center ps-1' variant="lead">
                                { appointment.surgery_time ? format(new Date(`1970-01-01T${appointment.surgery_time}`), "HH:mm")  : "s/h" }
                            </Typography>
                        </div>
                        <div className='flex flex-col pe-5'>
                            <div className='flex justify-between'>
                                <Typography variant='small'>ADM: </Typography>
                                <div className="flex w-5 h-5 items-center justify-center">
                                    <div
                                        className="h-2 w-2 rounded-full ring-4 shadow-xl"
                                        style={{
                                            backgroundColor: appointment.AdministrativeStatus.color,
                                            ringColor: `${appointment.AdministrativeStatus.color}50`,
                                            boxShadow: `0px 0px 8px ${appointment.AdministrativeStatus.color}`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <Typography variant='small'>ENF: </Typography>
                                <div className="flex w-5 h-5 items-center justify-center">
                                    <div
                                        className="h-2 w-2 rounded-full ring-4 shadow-xl"
                                        style={{
                                            backgroundColor: appointment.MedicalStatus.color,
                                            ringColor: `${appointment.MedicalStatus.color}50`,
                                            boxShadow: `0px 0px 8px ${appointment.MedicalStatus.color}`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        appointment.Surgeries.map((surgery, n) => {
                            return(
                                <div key={surgery.appointment_surgery.id} className='flex flex-row h-[1rem] pb-8'>
                                    <Typography className='ps-12 font-bold w-32'>
                                        {surgery.appointment_surgery.eye}
                                    </Typography>
                                    <Typography className='ps-3'>
                                        {surgery.name}
                                    </Typography>
                                    {
                                        surgery.appointment_surgery.intraocular_lens ?
                                            <>
                                            <Typography className='ps-12 font-bold'>
                                                Lente: 
                                            </Typography>
                                            <Typography className='ps-1'>
                                                {surgery.appointment_surgery.intraocular_lens}
                                            </Typography>
                                            </>
                                        : ""
                                    }
                                    
                                </div>
                            )
                        })
                    }
                </div>
            </AccordionHeader>
            <AccordionBody className='pb-5'>
                <div className='flex flex-col'>
                    <div className='flex flex-row justify-start'>
                        {
                            appointment.Patient.doctor ?
                                <>
                                <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                                    Médico:
                                </Typography>
                                <Typography className='content-center ps-1' variant="small">
                                    {appointment.Patient.doctor}
                                </Typography>
                                </>
                            : ""
                        }
                        {
                            appointment.surgeon ?
                                <>
                                <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                                    Cirujano:
                                </Typography>
                                <Typography className='content-center ps-1' variant="small">
                                    {appointment.surgeon}
                                </Typography>
                                </>
                            : ""
                        }
                        {
                            appointment.Patient.phone1 ?
                                <>
                                <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                                    Tel 1:
                                </Typography>
                                <Typography className='content-center ps-1' variant="small">
                                    {appointment.Patient.phone1}
                                </Typography>
                                </>
                            : ""
                        }
                        {
                            appointment.Patient.phone2 ?
                                <>
                                <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                                    Tel 2:
                                </Typography>
                                <Typography className='content-center ps-1' variant="small">
                                    {appointment.Patient.phone2}
                                </Typography>
                                </>
                            : ""
                        }
                        {
                            appointment.Patient.email ?
                                <>
                                <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                                    Email:
                                </Typography>
                                <Typography className='content-center ps-1' variant="small">
                                    {appointment.Patient.email}
                                </Typography>
                                </>
                            : ""
                        }
                        <div className='flex flex-row ms-auto me-10'>
                            <PencilSquareIcon className="h-6 w-6 text-orange-500 mx-2 cursor-pointer" onClick={() => editAppointment(appointment.id, appointment.patient_id)} />
                            <TrashIcon className="h-6 w-6 text-red-500 mx-2" />
                        </div>
                    </div>
                    <div className='flex flex-row w-full'>
                        <div className='pt-2 w-[45%]'>
                            <Typography className='ps-5 font-bold' variant='paragraph'>
                                Administración
                            </Typography>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Recibio:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    Judith
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Estado:
                                </Typography>
                                <div className="flex w-5 h-5 items-center justify-center">
                                    <div
                                        className="h-2 w-2 rounded-full ring-4 shadow-xl"
                                        style={{
                                            backgroundColor: appointment.AdministrativeStatus.color,
                                            ringColor: `${appointment.AdministrativeStatus.color}50`,
                                            boxShadow: `0px 0px 8px ${appointment.AdministrativeStatus.color}`,
                                        }}
                                    ></div>
                                </div>
                                <Typography className='ps-1' variant='small'>
                                    {appointment.AdministrativeStatus.name}
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Observaciones:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    {appointment.AdministrativeStatus.notes}
                                </Typography>
                            </div>
                        </div>
                        <div className='pt-2'>
                            <Typography className='ps-5 font-bold' variant='paragraph'>
                                Enfermería
                            </Typography>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Recibio:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    Yanina
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Estado:
                                </Typography>
                                <div className="flex w-5 h-5 items-center justify-center">
                                    <div
                                        className="h-2 w-2 rounded-full ring-4 shadow-xl"
                                        style={{
                                            backgroundColor: appointment.MedicalStatus.color,
                                            ringColor: `${appointment.MedicalStatus.color}50`,
                                            boxShadow: `0px 0px 8px ${appointment.MedicalStatus.color}`,
                                        }}
                                    ></div>
                                </div>
                                <Typography className='ps-1' variant='small'>
                                    {appointment.MedicalStatus.name}
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Observaciones:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    {appointment.MedicalStatus.notes}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full h-[2px] bg-gradient-to-r from-pink-500 to-red-500 rounded-[1px] mt-5'></div>
            </AccordionBody>
        </Accordion>
    )
}

export default PatientCard