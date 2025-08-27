import { IconButton, Input, Button, Textarea, Typography } from "@material-tailwind/react"
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline"
import DatePicker from "../DatePicker"

const IncidentForm = ({ appointment, handleAppointment }) => {

    return (
        <>
            <Typography className='font-bold flex pb-3'>Incidentes</Typography>
            <div className='pb-5'>
                <div className='flex'>
                    <Textarea
                        name='incidents'
                        variant='outlined'
                        label='Incidentes'
                        value={appointment.incidents}
                        onChange={handleAppointment}
                    />
                </div>
            </div>
        </>
    )
}

export default IncidentForm