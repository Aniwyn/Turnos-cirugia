import { React, useEffect, useState } from 'react'
import { Spinner, Typography } from "@material-tailwind/react"

const LoadingScreen = ({ loadingMenssage = "Cargando..." }) => {
    const [message, setMessage] = useState("")

    useEffect(() => {
        setMessage(loadingMenssage)
    }, [])
    
    return(
        <div className='flex h-screen w-screen bg-[#FFFFFF]/20 absolute' >
            <div className='m-auto'>
                <Spinner color="green" className="h-12 w-12 mx-auto" />
                <Typography>{message}</Typography>
            </div>
        </div>
    )
}

export default LoadingScreen