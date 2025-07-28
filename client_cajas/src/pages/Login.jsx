import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import { Button, Card, CardHeader, CardBody, Image, Input } from "@heroui/react"
import useAuthStore from "../store/useAuthStore"

const Login = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuthStore()

    useEffect(() => { if (isAuthenticated) navigate('/') }, [])
    
    const handleLogin = async () => {
        try {
            await login(name, password)
            navigate("/")
        } catch (err) {
            setError(err.message)
        }
    }

    //<Image src={logo} isBlurred className="w-[50%] mx-auto" />

    return (
        <div className="flex w-screen h-screen">
            <div className="flex flex-col items-center justify-center w-[60%] bg-[url('/src/assets/bg.jpg')] bg-cover bg-center h-full">
                <strong className='text-gray-100 text-5xl'>¡Bienvenido de vuelta!</strong>
                <span className='text-gray-100 text-2xl'>Clínica de Ojos de Jujuy</span>
            </div>
            <div className="flex w-[40%]">
                <Card className="w-[400px] h-[400px] m-auto p-5 text-stone-600 shadow-none">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        <strong className="font-bold text-3xl">Inicio de sesión</strong>
                    </CardHeader>
                    <CardBody className="mt-10 gap-6">
                        <Input label="Usuario" type="text" value={name} onValueChange={setName} />
                        <Input label="Contraseña" type="password" value={password} onValueChange={setPassword}/>
                        <Button
                            className="bg-linear-to-tr from-emerald-500 to-green-500 text-white shadow-lg text-xl h-12 my-5"
                            radius="full"
                            onPress={handleLogin}
                        >
                            Iniciar sesión
                        </Button>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Login