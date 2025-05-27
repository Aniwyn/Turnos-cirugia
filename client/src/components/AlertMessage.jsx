import { useState, useEffect } from 'react'
import { Alert } from "@material-tailwind/react";

const AlertMessage = ({ time = 2500, alert, setAlert }) => {
    useEffect(() => {
        setAlert({...alert, show: true})
        const timer = setTimeout(() => {
            setAlert({...alert, show: false})
        }, time)

        return () => clearTimeout(timer)
    }, [])

    return(
        <Alert
            color={alert.color}
            className='fixed bottom-3 right-3 w-2/5 h-10 py-2 px-4 z-[9999]'
            open={alert.show}
        >
            {alert.message}
        </Alert>
    )
}

export default AlertMessage