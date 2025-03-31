import { useState, useEffect } from 'react'
import { Alert } from "@material-tailwind/react";

const AlertMessage = ({ color, text, time = 2500 }) => {
    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAlert(false)
        }, time)

        return () => clearTimeout(timer)
    }, [time])

    return(
        <Alert
            color={color}
            className='absolute bottom-3 right-3 w-2/5 h-10 py-2 px-4'
            open={showAlert}
        >
            {text}
        </Alert>
    )
}

export default AlertMessage