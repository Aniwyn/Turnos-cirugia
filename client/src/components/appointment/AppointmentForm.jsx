import { React } from 'react'
import { IconButton, Input, Option, Select, Textarea, Typography } from "@material-tailwind/react"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import DatePicker from "../DatePicker"

const AppointmentForm = ({ appointment, statuses, clearStatus, surgeryDate, surgeryHour,surgeryMinute, surgeries, surgeons, handleAppointment,handleStatus,handleSurgeon, handleSurgeryHour, handleSurgeryMinute, setSurgeryDate, addSurgery, removeSurgery, updateSurgery }) => {
    const availableHours = ["6", "7", "8", "9", "10", "11", "12", "13", "14"]
    const availableMinutes = ["00", "15", "30", "45"]

    return (
        <div>
            <Typography className='font-bold flex pb-3'>Turno</Typography>
            <div className='pb-5'>
                <div className='flex pb-3'>
                    <Select
                        key="selectStatus"
                        name="status"
                        label="Estado"
                        value={appointment.status}
                        onChange={handleStatus}
                    >
                        {
                            statuses.map(status => {
                                return (
                                    <Option key={status.id} value={status.id.toString()}>{status.name}</Option>
                                )
                            })
                        }
                    </Select>
                    <IconButton 
                        variant="text" 
                        onClick={clearStatus} 
                        disabled={!appointment.status}
                    >
                        <XMarkIcon className="h-6 w-6 text-red-500" />
                    </IconButton>
                </div>
                <div className='flex pb-3 gap-3'>
                    <DatePicker title="Fecha" date={surgeryDate} setDate={setSurgeryDate} />
                    <Select
                        key="selectHour"
                        name="surgeryHour"
                        label="Hora"
                        value={surgeryHour}
                        onChange={handleSurgeryHour}
                    >
                        {
                            availableHours.map(hour => {
                                return(
                                    <Option key={`hour${hour}`} value={hour}>{hour}</Option>
                                )
                            })
                        }
                    </Select>
                    <Select
                        key="selectMinute"
                        name="surgeryMinute"
                        label="Minuto"
                        value={surgeryMinute}
                        onChange={handleSurgeryMinute}
                    >
                        {
                            availableMinutes.map(minute => {
                                return(
                                    <Option key={`minute${minute}`} value={minute}>{minute}</Option>
                                )
                            })
                        }
                    </Select>
                </div>
                {appointment.surgeries?.map((surgery, index) => {
                    return (
                        <div key={`${surgery.surgery_id}${index}`} className='flex gap-3 py-1'>
                            <Select
                                key="selectEye"
                                name='eye'
                                label="Ojo" 
                                value={surgery.eye}
                                onChange={(val) => updateSurgery(index, 'eye', val)}
                            >
                                <Option value='OD'>Ojo Derecho</Option>
                                <Option value='OI'>Ojo Izquierdo</Option>
                                <Option value='AO'>Ambos Ojos</Option>
                            </Select>
                            <Input 
                                variant='outlined' 
                                label="Lente sugerido" 
                                placeholder='EyeOL' 
                                value={surgery.intraocular_lens} 
                                onChange={(e) => updateSurgery(index, 'intraocular_lens', e.target.value)} 
                            />
                            <div className='flex'>
                                <Select
                                    key="surgeries"
                                    name="surgeries"
                                    label="Cirugias"
                                    value={surgery.surgery_id}
                                    onChange={(val) => updateSurgery(index, 'surgery_id', val)}
                                >
                                    {
                                        surgeries.map(surgery => {
                                            return (
                                                <Option key={surgery.id} value={surgery.id}>{surgery.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <IconButton variant="text" onClick={() => removeSurgery(index)} className='px-3' >
                                <XMarkIcon className="h-6 w-6 text-red-500" />
                            </IconButton>
                        </div>
                    )
                })}
                <div className='flex justify-center my-3'>
                    <IconButton onClick={addSurgery} variant='outlined'>
                        <PlusIcon className="h-5 w-5" />
                    </IconButton>
                </div>
                <div className='flex pb-3'>
                    <Select
                        key="selectSurgeon"
                        name="surgeon"
                        label="Cirujano"
                        onChange={handleSurgeon}
                    >
                        {
                            surgeons.map(surgeon => {
                                return (
                                    <Option key={surgeon.id} value={surgeon.id.toString()}>{surgeon.name}</Option>
                                )
                            })
                        }
                    </Select>
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
        </div>
    )
}

export default AppointmentForm