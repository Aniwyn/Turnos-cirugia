import { useEffect, useState } from "react"
import { Spinner } from "@heroui/react"

const LoadingPage = () => {
    return (
        <div className="flex flex-col fixed top-0 left-0 h-screen w-screen z-999 justify-center items-center bg-gray-600/50">
            <Spinner size="lg" color="warning"/>
            <h3 className="text-center text-xl">Cargando...</h3>
        </div>
    )
}

export default LoadingPage