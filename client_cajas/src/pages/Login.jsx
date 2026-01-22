import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import { Button, Card, CardHeader, CardBody, Form, Input } from "@heroui/react"
import useAuthStore from "../store/useAuthStore"

const Login = () => {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuthStore()
    const errors = {}

    useEffect(() => { if (isAuthenticated) navigate('/') }, [])

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await login(name, password)
            navigate("/")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-[url('/src/assets/bg.jpg')] bg-cover bg-center">
            <div className="hidden lg:flex flex-col items-center justify-center w-[60%] h-full  relative">
                <div className="relative z-10 flex flex-col items-center text-stone-700 p-12 text-center">
                    <strong className='text-5xl font-bold mb-4 drop-shadow-lg'>¡Bienvenido de vuelta!</strong>
                    <span className='text-2xl font-light tracking-wide drop-shadow-md'>Clínica de Ojos Jujuy</span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full lg:w-[40%] h-full z-10">
                <div className="w-full max-w-100 px-6 flex flex-col items-center bg-white rounded-2xl py-5">
                    <Card className="w-full shadow-none border-none bg-transparent">
                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                            <div className="flex flex-col items-center gap-4 mb-10">
                                <img src="/logo_prisma.png" alt="Logo Prisma" className="h-24 w-auto object-contain" />
                                <div className="inline-flex flex-col gap-1 font-sans tracking-[0.02em]">
                                    <div className="relative inline-block">
                                        <span
                                            className="relative text-[2.5rem] leading-none font-extrabold
                                   tracking-[0.08em] uppercase text-[#1d2431]
                                   [text-shadow:0_1px_0_rgba(255,255,255,0.35)]"
                                        >
                                            PRISMA
                                        </span>
                                        <span
                                            className="absolute -left-[0.05em] -right-[0.05em] -bottom-[0.18em] h-[0.22em] rounded-full
                                   bg-[linear-gradient(90deg,#00D4FF_0%,#2DE2A6_22%,#A6FF4D_40%,#FFD24A_58%,#FF5AA5_78%,#8B5CFF_100%)]
                                   opacity-[0.85] blur-[0.25px]"
                                            aria-hidden="true"
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-visible">
                            <Form
                                className="w-full flex flex-col gap-6 mt-4"
                                validationErrors={errors}
                                onSubmit={onSubmit}
                            >
                                {error && (
                                    <div className="p-3 rounded-lg bg-danger-50 border border-danger-100 text-danger text-sm text-center animate-appearance-in">
                                        {error}
                                    </div>
                                )}

                                <Input
                                    label="Usuario"
                                    type="text"
                                    variant="bordered"
                                    value={name}
                                    onValueChange={setName}
                                    isRequired
                                    classNames={{
                                        inputWrapper: "border-1 hover:border-primary focus-within:border-primary",
                                        label: "text-gray-500"
                                    }}
                                />
                                <Input
                                    label="Contraseña"
                                    type="password"
                                    variant="bordered"
                                    value={password}
                                    onValueChange={setPassword}
                                    isRequired
                                    classNames={{
                                        inputWrapper: "border-1 hover:border-primary focus-within:border-primary",
                                        label: "text-gray-500"
                                    }}
                                />

                                <Button
                                    className="w-full bg-linear-to-tr from-emerald-500 to-green-500 text-white shadow-lg text-lg font-medium h-12 mt-2"
                                    radius="full"
                                    type="submit"
                                >
                                    Iniciar sesión
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            Sistema de Gestión Integral
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login