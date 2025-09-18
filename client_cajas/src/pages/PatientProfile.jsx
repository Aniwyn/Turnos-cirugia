import { useState } from 'react'
import { useParams } from "react-router-dom"

 
const PatientProfile = () => {
    const { id } = useParams()

    return(
        <>
        Hello world!!
        {id}
        </>
    )
}

export default PatientProfile