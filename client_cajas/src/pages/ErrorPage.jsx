import { useEffect, useState } from "react"
import { CircleX } from 'lucide-react'

const ErrorPage = ({ errorMessage }) => {
    return (
        <div className="flex flex-col w-[300px] mx-auto mt-[30vh] justify-center items-center">
            <CircleX size={96} strokeWidth={0.8} color="red"/>
            <h3 className="text-center text-xl">{ errorMessage }</h3>
        </div>
    )
}

export default ErrorPage