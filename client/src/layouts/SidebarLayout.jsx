import { Link } from "react-router-dom"
import { Avatar, Card, Button, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react"
import { ClockIcon, DocumentPlusIcon, PowerIcon } from "@heroicons/react/24/outline"
import useAuthStore from "../store/authStore"

const SidebarLayout = ({ children }) => {
    const { user, logout } = useAuthStore();

    return (
        <div className="flex h-full">
            <Card className="h-[calc(100vh-2.5rem)] w-full max-w-[20rem] bg-gray-800 text-white m-2 p-4 shadow-xl shadow-blue-gray-900/5">
                <Avatar src={`https://docs.material-tailwind.com/img/face-2.jpg`} alt="avatar" size="xl" className="mx-auto" />
                <Typography variant="h4" className="text-center">{user.name}</Typography>
                <Typography variant="h4" className="text-center">{user.role}</Typography>
                <nav>
                    <List className="mt-10">
                        <Link to="/">
                            <ListItem className="text-white hover:text-black">
                                <ListItemPrefix className="mr-2">
                                    <ClockIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography>Turnos</Typography>
                            </ListItem>
                        </Link>
                        <Link to="/Appointment">
                            <ListItem className="text-white hover:text-black">
                                <ListItemPrefix className="mr-2">
                                    <DocumentPlusIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography>Registro</Typography>
                            </ListItem>
                        </Link>
                        <Link to="/Login">
                            <ListItem className="text-white hover:text-black">
                                Login -borrar
                            </ListItem>
                        </Link>
                        <Link to="/NotFound">
                            <ListItem className="text-white hover:text-black">
                                404 - borrar
                            </ListItem>
                        </Link>
                        <Link onClick={logout}>
                            <ListItem className="text-white hover:text-black">
                                <ListItemPrefix className="mr-2">
                                    <PowerIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography>Cerrar sesión</Typography>
                            </ListItem>
                        </Link>
                    </List>
                </nav>
            </Card>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default SidebarLayout;