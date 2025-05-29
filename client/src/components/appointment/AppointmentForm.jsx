import { React } from 'react'
import { IconButton, Input, Button, Textarea, Typography } from "@material-tailwind/react"
import Select from 'react-select'
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import DatePicker from "../DatePicker"

const AppointmentForm = ({ appointment, statuses, surgeryDate, surgeryHour, surgeryMinute, surgeries, surgeons, handleAppointment, handleStatus, handleSurgeon, handleSurgeryHour, handleSurgeryMinute, setSurgeryDate, addSurgery, removeSurgery, updateSurgery }) => {
    const availableHours = [
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
        { value: "13", label: "13" },
        { value: "14", label: "14" },
        { value: "15", label: "15" },
        { value: "16", label: "16" },
    ]

    const availableMinutes = [
        { value: "00", label: "00" },
        { value: "15", label: "15" },
        { value: "30", label: "30" },
        { value: "45", label: "45" },
    ]

    const availableEyes = [
        { value: "OD", label: "Ojo Derecho" },
        { value: "OI", label: "Ojo Izquierdo" },
        { value: "AO", label: "Ambos Ojos" },
    ]

    let statusesOptions = []
    statuses.map(status => {
        if (status.id != 0) statusesOptions.push({ value: status.id, label: status.name })
    })

    let surgeriesOptions = []
    surgeries.map(surgery => {
        surgeriesOptions.push({ value: surgery.id, label: surgery.name, useLens: surgery.useLens })
    })

    let surgeonsOptions = []
    surgeons.map(surgeon => {
        surgeonsOptions.push({ value: surgeon.id, label: surgeon.name })
    })

    return (
        <>
            <Typography className='font-bold flex pb-3'>Turno</Typography>
            <div className='pb-5'>
                <div className='flex pb-3'>
                    <Select
                        placeholder="Estado..."
                        options={statusesOptions}
                        value={appointment.status}
                        onChange={handleStatus}
                        className='w-full'
                        defaultValue={1}
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'grey' : 'rgb(176 190 197)',
                                height: '40px',
                            }),
                        }}
                    />
                </div>
                <div className='flex pb-3 gap-3'>
                    <DatePicker title="Fecha" date={surgeryDate} setDate={setSurgeryDate} />
                    <Select
                        placeholder="Hora"
                        options={availableHours}
                        value={surgeryHour}
                        onChange={handleSurgeryHour}
                        className='w-full'
                        isClearable
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'grey' : 'rgb(176 190 197)',
                                height: '40px',
                            }),
                        }}
                    />
                    <Select
                        placeholder="Minuto"
                        options={availableMinutes}
                        value={surgeryMinute}
                        onChange={handleSurgeryMinute}
                        className='w-full'
                        isClearable
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused ? 'grey' : 'rgb(176 190 197)',
                                height: '40px',
                            }),
                        }}
                    />
                </div>
                {appointment.surgeries?.map((surgery, index) => {
                    return (
                        <div key={`${surgery.surgery_id}${index}`} className='grid grid-cols-12 gap-3 bg-gray-100 mb-3 p-1 rounded-lg'>
                            <div className='col-span-3 flex ps-3'>
                                <Select
                                    placeholder="Ojo"
                                    options={availableEyes}
                                    value={surgery.eye}
                                    onChange={(val) => updateSurgery(index, 'eye', val)}
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
                            <div className='col-span-3 flex'>
                                <Input
                                    variant='outlined'
                                    label="Lente sugerido"
                                    placeholder='EyeOL'
                                    value={surgery.surgery_id?.useLens == 1 ? surgery.intraocular_lens : ""}
                                    onChange={(e) => updateSurgery(index, 'intraocular_lens', e.target.value)}
                                    className='bg-white'
                                    disabled={surgery.surgery_id?.useLens != 1}
                                />
                            </div>
                            <div className='col-span-5 flex ps-3'>
                                <Select
                                    placeholder="Cirugía"
                                    options={surgeriesOptions}
                                    value={surgery.surgery_id}
                                    onChange={(val) => updateSurgery(index, 'surgery_id', val)}
                                    className='w-full'
                                    defaultValue={{ value: 1, label: "Cataratas" }}
                                    styles={{
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            borderColor: state.isFocused ? 'grey' : 'rgb(176 190 197)',
                                            height: '40px',
                                        }),
                                    }}
                                />
                            </div>
                            <div className='col-span-1 flex'>
                                <IconButton variant="text" onClick={() => removeSurgery(index)} className='' >
                                    <XMarkIcon className="h-6 w-6 text-red-500" />
                                </IconButton>
                            </div>
                        </div>
                    )
                })}
                <div className='flex justify-center my-3'>
                    <Button  onClick={addSurgery} variant='text' className='flex items-center gap-3'>
                        <PlusIcon className="h-5 w-5" />
                        Añadir cirugía
                    </Button>
                </div>
                <div className='flex pb-3'>
                    <Select
                        placeholder="Cirujano"
                        options={surgeonsOptions}
                        value={appointment.surgeon_id}
                        onChange={handleSurgeon}
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
                <div className='flex'>
                    <Textarea
                        name='notes'
                        variant='outlined'
                        label='Observaciones'
                        value={appointment.notes}
                        onChange={handleAppointment}
                    />
                </div>
            </div>
        </>
    )
}

export default AppointmentForm