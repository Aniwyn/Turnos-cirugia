import { React } from 'react'
import { Button, Input, Typography } from "@material-tailwind/react"
import Select from 'react-select'

const PatientForm = ({ patient, medics, handlePatient, handleMedic, newPatient, findPatient, errors }) => {
    let options = []
    medics.map(medic => {
        options.push({ value: medic.id, label: medic.name })
    })

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
                        placeholder="Médico..."
                        options={options}
                        value={patient.medic_id}
                        onChange={handleMedic}
                        isClearable
                        className='w-full'
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'grey' : 'rgb(176 190 197)',
                                height: '40px',
                            }),
                        }}
                    />
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