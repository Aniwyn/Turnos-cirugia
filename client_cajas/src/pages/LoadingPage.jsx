import { useEffect, useState } from "react"
import { Spinner } from "@heroui/react"

const LoadingPage = () => {
    return (
        <div className="flex flex-col fixed top-0 left-0 h-[100vh] w-[100vw] z-999 justify-center items-center bg-gray-600/50">
            <Spinner size="lg" color="success"/>
            <h3 className="text-center text-xl">Cargando...</h3>
        </div>
    )
}

export default LoadingPage