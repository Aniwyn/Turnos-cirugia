import React from 'react'
import { Typography } from "@material-tailwind/react"

const SurgeryItem = ({ surgery }) => {
    return (
        <div className='flex flex-row h-[1rem] pb-8'>
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
}

export default SurgeryItem