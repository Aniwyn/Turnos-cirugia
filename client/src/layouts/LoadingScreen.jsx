import { React } from 'react'
import { Spinner } from "@material-tailwind/react"

const loadingScreen = ( show = false ) => {
    return(
        <div className='h-screen w-screen bg-[#FFFFFF]/20 absolute top-[50px] left-[50px] z-40' visibility={show}>
            <Spinner color="green" className="h-12 w-12" />
        </div>
    )
}

export default loadingScreen