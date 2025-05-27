import { React } from 'react'
import { Spinner, Typography } from "@material-tailwind/react"

const LoadingScreen = ({ loadingMenssage = "Cargando..." }) => {
    return(
        <div className='flex h-screen w-screen bg-[#FFFFFF]/20 absolute' >
            <div className='m-auto'>
                <Spinner color="green" className="h-12 w-12 mx-auto" />
                <Typography className='pt-3'>{loadingMenssage}</Typography>
            </div>
        </div>
    )
}

export default LoadingScreen