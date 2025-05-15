import { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import { Card, Input, Button, CardBody, CardHeader, Typography } from "@material-tailwind/react"
import useAuthStore from "../store/authStore"

const Login = () => {
    const [name, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("") //Mousequeherramientamisterosa (?)
    const navigate = useNavigate()
    const { login, isAuthenticated } = useAuthStore()

    useEffect(() => { if (isAuthenticated) navigate('/') }, [])

    const handleUser = (e) => { setUser(e.target.value) }
    const handlePass = (e) => { setPass(e.target.value) }

    const handleSubmit = async () => {
        try {
            await login(name, pass)
            navigate("/")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <Card
            shadow={false}
            className="md:px-24 md:py-14 py-8 my- border border-gray-300 max-w-[600px] m-auto"
        >
            <CardHeader shadow={false} floated={false} className="text-center">
                <Typography variant="h1" color="blue-gray" className="mb-4 !text-3xl lg:text-4xl" >
                    Login
                </Typography>
            </CardHeader>
            <CardBody>
                <form action="#" className="flex flex-col gap-4 md:mt-8" >
                    <div>
                        <label htmlFor="name">
                            <Typography variant="small" color="blue-gray" className="font-bold block mb-2" >
                                Usuario
                            </Typography>
                        </label>
                        <Input
                            id="name"
                            color="gray"
                            size="lg"
                            type="text"
                            name="name"
                            placeholder="Jonathan"
                            onChange={handleUser}
                            value={name}
                            className="!w-full placeholder:!opacity-100 focus:!border-t-primary !border-t-blue-gray-200"
                            labelProps={{
                                className: "hidden",
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="passWord">
                            <Typography variant="small" color="blue-gray" className="font-bold block mb-3" >
                                Contraseña
                            </Typography>
                        </label>
                        <Input
                            color="gray"
                            size="lg"
                            type="passWord"
                            name="password"
                            placeholder="A#32-aH&//*Gg0"
                            onChange={handlePass}
                            value={pass}
                            className="!w-full placeholder:!opacity-100 focus:border-gray-200 !border-blue-gray-200"
                            labelProps={{ className: "hidden" }}
                        />
                    </div>
                    <Button size="lg" color="gray" className='mt-8' fullWidth onClick={handleSubmit}>
                        Iniciar sesion
                    </Button>
                </form>
            </CardBody>
        </Card>
    )
}

export default Login