import { useEffect, useState } from "react"
import { Spinner } from "@heroui/react"

const LoadingPage = () => {
    return (
        <div className="flex flex-col w-[300px] mx-auto mt-[30vh] justify-center">
            <Spinner size="lg" color="success"/>
            <h3 className="text-center text-xl">Cargando...</h3>
        </div>
    )
}

export default LoadingPage