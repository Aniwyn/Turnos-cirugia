import { Link } from "react-router-dom"
import { Avatar, Card, Button, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react"
import { ClockIcon, DocumentPlusIcon, PowerIcon } from "@heroicons/react/24/outline"
import useAuthStore from "../store/authStore"

const SidebarLayout = ({ children }) => {
    const { user, logout } = useAuthStore();
    const sideBarWidth = "18rem"

    return (
        <div className="flex h-full">
            <Card className={`fixed top-0 left-0 h-[calc(100vh-2.5rem)] w-full bg-gray-800 text-white m-[0.5rem] p-4 pt-10 shadow-xl shadow-blue-gray-900/5 z-50`} style={{ maxWidth: sideBarWidth }}>
                <Avatar src={`https://docs.material-tailwind.com/img/face-2.jpg`} alt="avatar" size="xl" className="mx-auto" />
                <Typography variant="h4" className="text-center">{user.name}</Typography>
                <Typography variant="h4" className="text-center">{user.role}</Typography>
                <List className="flex flex-col h-full mt-8">
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
                    {/*<Link to="/Login">
                        <ListItem className="text-white hover:text-black">
                            Login -borrar
                        </ListItem>
                    </Link>
                    <Link to="/NotFound">
                        <ListItem className="text-white hover:text-black">
                            404 - borrar
                        </ListItem>
                    </Link>*/}
                    <ListItem onClick={logout} className="text-white hover:text-black mt-auto">
                        <ListItemPrefix className="mr-2">
                            <PowerIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        <Typography>Cerrar sesión</Typography>
                    </ListItem>
                </List>
            </Card>
            <div style={{ width: `calc(100vw - ${sideBarWidth})`, marginLeft: `calc(1rem + ${sideBarWidth})` }} className='flex'>{children}</div>
        </div>
    );
};

export default SidebarLayout;