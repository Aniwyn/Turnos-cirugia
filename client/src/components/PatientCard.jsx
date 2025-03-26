import React from 'react'
import { Accordion, AccordionHeader, AccordionBody, Typography } from "@material-tailwind/react";
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";


function Icon({ id, open }) {
    return (
        <ChevronDownIcon
            className={`${id === open ? "rotate-180" : ""} h-6 w-6 text-gray-500`}
        />
    );
}

const PatientCard = ({ openNumber, openStatus, handleOpenStatus }) => {
    return(
        <Accordion open={openStatus === openNumber} icon={<Icon id={openNumber} open={openStatus} />}>
            <AccordionHeader onClick={() => handleOpenStatus(openNumber)} className='border-b-0 p-0'> {/*pb-0*/}
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row justify-between w-full'>
                        <div className='flex'>
                            <Typography className={`content-center transition-colors ${ openStatus === openNumber ? "bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent" : ""}`} variant="h5">
                                Jonathan Alexis Tiano
                            </Typography>
                            <Typography className='content-center ps-4' variant="lead">
                                IOSFA
                            </Typography>
                        </div>
                        <div className='flex'>
                            <Typography className={'content-center transition-colors font-bold'} variant="lead">
                                Fecha:
                            </Typography>
                            <Typography className='content-center ps-1' variant="lead">
                                10/01/2025
                            </Typography>
                        </div>
                        <div className='flex'>
                            <Typography className={'content-center transition-colors font-bold'} variant="lead">
                                Hora:
                            </Typography>
                            <Typography className='content-center ps-1' variant="lead">
                                9:00
                            </Typography>
                        </div>
                        <div className='flex flex-col pe-5'>
                            <div className='flex justify-between'>
                                <Typography variant='small'>ADM: </Typography>
                                <div className="flex w-5 h-5 items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-green-500 ring-4 ring-cyan-300/50 shadow-xl shadow-cyan-500/80"></div>
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <Typography variant='small'>ENF: </Typography>
                                <div className="flex w-5 h- items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-300/50 shadow-xl shadow-cyan-500/80"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row h-[1rem]'>
                        <Typography className='ps-12 font-bold w-32'>
                            OD 
                        </Typography>
                        <Typography className='ps-3'>
                            Glaucoma
                        </Typography>
                    </div>
                    <div className='flex flex-row h-[1rem] pb-8'>
                        <Typography className='ps-12 font-bold w-32'>
                            OD 
                        </Typography>
                        <Typography className='ps-3'>
                            Catarata
                        </Typography>
                        <Typography className='ps-12 font-bold'>
                            Lente: 
                        </Typography>
                        <Typography className='ps-1'>
                            EyeIOL 
                        </Typography>
                    </div>
                </div>
            </AccordionHeader>
            <AccordionBody className='pb-5'>
                <div className='flex flex-col'>
                    <div className='flex flex-row justify-start'>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                            Médico:
                        </Typography>
                        <Typography className='content-center ps-1' variant="small">
                            Zarif A.
                        </Typography>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                            Tel 1:
                        </Typography>
                        <Typography className='content-center ps-1' variant="small">
                            38812345678
                        </Typography>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                            Tel 2:
                        </Typography>
                        <Typography className='content-center ps-1' variant="small">
                            38887654321
                        </Typography>
                        <Typography className={'content-center transition-colors font-bold ps-5'} variant="small">
                            Email:
                        </Typography>
                        <Typography className='content-center ps-1' variant="small">
                            example@not.com.ar
                        </Typography>
                        <div className='flex flex-row ms-auto me-10'>
                            <PencilSquareIcon className="h-6 w-6 text-orange-500 mx-2" />
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
                                    <div className="h-2 w-2 rounded-full bg-green-500 ring-4 ring-cyan-300/50 shadow-xl shadow-cyan-500/80"></div>
                                </div>
                                <Typography className='ps-1' variant='small'>
                                    Listo
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Observaciones:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    Pago completo
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Lente pagada:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    Torica
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
                                <div className="flex w-5 h- items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-red-500 ring-4 ring-red-300/50 shadow-xl shadow-cyan-500/80"></div>
                                </div>
                                <Typography className='ps-1' variant='small'>
                                    Falta documentación prequirurgica
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Observaciones:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    Falta electrocrdiograma
                                </Typography>
                            </div>
                            <div className='flex'>
                                <Typography className='ps-12 pe-3 font-bold' variant='small'>
                                    Lente sugerida:
                                </Typography>
                                <Typography className='ps-1' variant='small'>
                                    EyeOL
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

/*Bueno ya tengo una Back y un maquetado funcional en React, podrias ayudarme ahora a conectar la bd? me gustaria empezar con poder traer los datos de turnos de la api*/