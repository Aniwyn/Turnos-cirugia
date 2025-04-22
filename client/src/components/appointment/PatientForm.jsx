import { React } from 'react'
import { Button, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const PatientForm = ({ patient, medics, clearMedic, handlePatient, handleDoctor, newPatient, findPatient, errors }) => {
    return (
        <div className='flex flex-col w-full mx-auto pb-5'>
            <div className='flex'>
                <Typography className='font-bold flex pb-3'>Paciente</Typography>
                <Typography className='text-red-800'>*</Typography>
            </div>
            <div className='flex pb-3'>
                <div className='flex w-1/2'>
                    <Input
                        name='dni'
                        variant='outlined'
                        label="DNI *"
                        placeholder='12345678'
                        value={patient.dni}
                        onChange={handlePatient}
                        disabled={!newPatient}
                        autoFocus
                    />
                    <Button
                        onClick={findPatient}
                        className='w-full ms-3'
                        disabled={!newPatient || errors.dni || !patient.dni}
                    >
                        Buscar
                    </Button>
                </div>
                {errors.dni && <Typography color="red" variant="small" className='content-center ps-4'>{errors.dni}</Typography>}
            </div>
            <div className='flex pb-3 gap-3'>
                <div className='flex-col w-full'>
                    <Input
                        name='first_name'
                        variant='outlined'
                        label="Nombre/s *"
                        placeholder='Perez'
                        value={patient.first_name}
                        onChange={handlePatient}
                    />
                    {errors.first_name && <Typography color="red" variant="small">{errors.first_name}</Typography>}
                </div>
                <div className='flex flex-col w-full'>
                    <Input
                        name='last_name'
                        variant='outlined'
                        label="Apellido/s *"
                        placeholder='Juan Pablo'
                        value={patient.last_name}
                        onChange={handlePatient}
                    />
                    {errors.last_name && <Typography color="red" variant="small">{errors.last_name}</Typography>}
                </div>
            </div>
            <div className='flex pb-3 gap-3'>
                <Input
                    name='health_insurance'
                    variant='outlined'
                    label="Obra social"
                    placeholder='PAMI'
                    value={patient.health_insurance}
                    onChange={handlePatient}
                />
                <div className='flex w-full'>
                    <Select
                        key="doctor_id"
                        name='doctor_id'
                        label="Médico"
                        value={patient.doctor_id}
                        onChange={handleDoctor}
                    >
                        {
                            medics.map(medic => {
                                return (
                                    <Option key={medic.id} value={medic.id.toString()}>{medic.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <IconButton
                        variant="text"
                        disabled={!patient.doctor_id}
                        onClick={clearMedic}
                    >
                        <XMarkIcon className="h-6 w-6 text-red-500" />
                    </IconButton>
                </div>
            </div>
            <div className='flex pb-3 gap-3'>
                <Input
                    name='phone1'
                    variant='outlined'
                    label="Tel 1"
                    placeholder='3881234567'
                    value={patient.phone1}
                    onChange={handlePatient}
                />
                <Input
                    name='phone2'
                    variant='outlined'
                    label="Tel 2"
                    placeholder='3881234567'
                    value={patient.phone2}
                    onChange={handlePatient}
                />
            </div>
            <div className='flex'>
                <Input
                    name='email'
                    variant='outlined'
                    label='Email'
                    placeholder='correo@gmail.com'
                    value={patient.email}
                    onChange={handlePatient}
                />
            </div>
        </div>
    )
}

export default PatientForm