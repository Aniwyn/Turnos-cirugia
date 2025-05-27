import React from 'react'
import { Typography } from "@material-tailwind/react"

const UserState = ({ title, userName, status, note }) => {
    return (<>
        <Typography className='ps-5 font-bold' variant='paragraph'>{title}</Typography>
        <div className='flex'>
            <Typography className='ps-12 pe-3 font-bold' variant='small'>Recibio:</Typography>
            <Typography className='ps-1' variant='small'>{userName}</Typography>
        </div>
        <div className='flex'>
            <Typography className='ps-12 pe-3 font-bold' variant='small'>Estado:</Typography>
            <div className="flex w-5 h-5 items-center justify-center">
                <div
                    className="h-2 w-2 rounded-full ring-4 shadow-xl"
                    style={{
                        backgroundColor: status.color,
                        ringColor: `${status.color}50`,
                        boxShadow: `0px 0px 3px ${status.color}`,
                    }}
                ></div>
            </div>
            <Typography className='ps-1' variant='small'>{status.name}</Typography>
        </div>
        <div className='flex'>
            <Typography className='ps-12 pe-3 font-bold' variant='small'>Observaciones:</Typography>
            <Typography className='ps-1' variant='small'>{note}</Typography>
        </div>
    </>)
}

export default UserState