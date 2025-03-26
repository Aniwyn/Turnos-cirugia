import { React, useState } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { Accordion, AccordionHeader, AccordionBody, Collapse, Button, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react";
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import PatientCard from "../components/PatientCard";

function Icon({ id, open }) {
    return (
        <ChevronDownIcon
            className={`${id === open ? "rotate-180" : ""} h-6 w-6 text-gray-500`}
        />
    );
}

const Appointment = ({ id }) => {
    const [open, setOpen] = useState(2)
    const [dni, setDni] = useState()
    const [patientList, setPatientList] = useState([])
    const handleOpen = (value) => setOpen(open === value ? 0 : value);

    const findPatient = (e) => {

    }
    
    return(
        <SidebarLayout>
            <HeaderLayout>
                <div className='flex'>
                    <div className='mx-40 my-6 rounded-lg bg-gray-200'>
                        <Typography variant='h3' className='text-center'> Registrar turno</Typography>
                        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(1)} className='border-b-0 p-0'> {/*pb-0*/}
                                Paciente
                            </AccordionHeader>
                            <AccordionBody className='pb-5'>
                                <div className='flex w-[50%] mx-auto'>
                                    <Input variant='outlined' label="DNI" placeholder='12345678' value={dni}/>
                                    <Button onClick={findPatient}>Buscar</Button>
                                </div>
                                <Collapse open={true}>
                                    <div className='flex'>
                                        <Input variant='outlined' label="Nombre/s" placeholder='Perez' value={dni}/>
                                        <Input variant='outlined' label="Apellido/s" placeholder='Juan Pablo' value={dni}/>
                                    </div>
                                    <div className='flex'>
                                        <Input variant='outlined' label="Tel 1" placeholder='3881234567' value={dni}/>
                                        <Input variant='outlined' label="Tel 2" placeholder='3881234567' value={dni}/>
                                    </div>
                                    <div className='flex'>
                                        <Input variant='outlined' label='Email' placeholder='PAMI' value={dni}/>
                                        <Input variant='outlined' label="Obra social" placeholder='PAMI' value={dni}/>
                                    </div>
                                </Collapse>
                            </AccordionBody>
                        </Accordion>
                        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(2)} className='border-b-0 p-0'> {/*pb-0*/}
                                Turno
                            </AccordionHeader>
                            <AccordionBody className='pb-5'>
                                <div className='flex'>
                                    <Select label="Estado">
                                        <Option>Iniciado</Option>
                                        <Option>Falta documentacion pre</Option>
                                        <Option>Finalizado</Option>
                                    </Select>
                                </div>
                                <div className='flex'>
                                    <Select label="Ojo">
                                        <Option>OD AAAA</Option>
                                        <Option>OI AAAA</Option>
                                        <Option>AO AAAA</Option>
                                    </Select>
                                    <Input variant='outlined' label="Lente sugerido" placeholder='Cataratas' value={dni}/>
                                    <Input variant='outlined' label="Cirugía" placeholder='Cataratas' value={dni}/>
                                </div>
                                <div className='flex'>
                                    <Input variant='outlined' label='Medico' placeholder='Dr. Veronica Ase' value={dni}/>
                                </div>
                                <div className='flex'>
                                    <Input variant='outlined' label='Fecha' placeholder='10/01/1995' value={dni}/>
                                    <Input variant='outlined' label="Hora" placeholder='9:00' value={dni}/>
                                </div>
                                <div className='flex'>
                                    <Textarea variant='outlined' label='Observaciones' value={dni}/>
                                </div>
                            </AccordionBody>
                        </Accordion>
                        <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
                            <AccordionHeader onClick={() => handleOpen(3)} className='border-b-0 p-0'> {/*pb-0*/}
                                Revisión
                            </AccordionHeader>
                            <AccordionBody className='pb-5'>
                                <PatientCard openNumber={0} openStatus={0} handleOpenStatus={() => {}} />
                            </AccordionBody>
                        </Accordion>
                    </div>
                    <div>
                        <Button>Siguiente</Button>
                        <Button>Cancelar</Button>
                    </div>
                </div>
            </HeaderLayout>
        </SidebarLayout>
    )
}

export default Appointment