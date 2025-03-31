import { React, useState } from 'react'
import SidebarLayout from "../layouts/SidebarLayout";
import HeaderLayout from "../layouts/HeaderLayout";
import { useNavigate } from "react-router";
import { Card, Input, Button, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { login } from "../services/api";

const Login = () => {
    const [name, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState("") //Mousequeherramientamisterosa (?)
    let navigate = useNavigate()

    const handleUser = (e) => { setUser(e.target.value) }
    const handlePass = (e) => { setPass(e.target.value) }

    const handleSubmit = async (e) => {
        const result = await login(name, pass)

        if (!result.success) {
            setError(result.message);
        } else {
            navigate("/")
        }
    }

    return(
        <SidebarLayout>
            <HeaderLayout>
                <Card
                    shadow={false}
                    className="md:px-24 md:py-14 py-8 border border-gray-300 max-w-[600px] mx-auto"
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
                                    labelProps={{className: "hidden"}}
                                />
                            </div>
                            <Button size="lg" color="gray" className='mt-8' fullWidth onClick={handleSubmit}>
                                Iniciar sesion
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </HeaderLayout>
        </SidebarLayout>
    )
}

export default Login