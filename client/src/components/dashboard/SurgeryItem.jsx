import React from 'react'
import { Typography } from "@material-tailwind/react"

const SurgeryItem = ({ surgery }) => {
    return (
        <div className='grid grid-cols-10 flex flex-row h-[1rem] pb-8'>
            <Typography className='col-span-1 flex justify-center font-bold'>
                { surgery.appointment_surgery.eye }
            </Typography>
            <Typography className='col-span-4'>
                { surgery.name }
            </Typography>
            {
                surgery.appointment_surgery.intraocular_lens ?
                    <div className='col-span-3 flex'>
                        <Typography className='font-bold'>
                            Lente:
                        </Typography>
                        <Typography className='ps-2'>
                            { surgery.appointment_surgery.intraocular_lens }
                        </Typography>
                    </div>
                    : <></>
            }

        </div>
    )
}

export default SurgeryItem