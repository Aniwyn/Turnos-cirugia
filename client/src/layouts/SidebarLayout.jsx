import { Link } from "react-router-dom"
import { Avatar, Card, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react"
import { ClockIcon, DocumentPlusIcon, PowerIcon, CheckIcon } from "@heroicons/react/24/outline"
import useAuthStore from "../store/authStore"

const SidebarLayout = ({ children }) => {
    const { user, logout } = useAuthStore();
    const sideBarWidth = "18rem"

    const getRoleName = () => {
        if (user.role === "admin") return "Administración"
        else if (user.role === "nurse") return "Enfermería"
        else return "unknown"
    }

    return (
        <div className="flex h-full">
            <Card className={`fixed top-0 left-0 h-[calc(100vh-2.5rem)] w-full bg-gray-800 text-white m-[0.5rem] p-4 pt-10 shadow-xl shadow-blue-gray-900/5 z-50`} style={{ maxWidth: sideBarWidth }}>
                <Avatar 
                src={`/profile_images/${user.name}.jpg`} 
                alt="avatar" size="xl" className="mx-auto"
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/profile_images/user.jpg"
                }}
                />
                <Typography variant="h4" className="text-center pt-2 bg-gradient-to-r from-green-600 to-teal-300 bg-clip-text text-transparent">{charAt(0).toUpperCase() + this.slice(1)}</Typography>
                <Typography variant="small" className="text-center">{getRoleName()}</Typography>
                <List className="flex flex-col h-full mt-8">
                    <Link to="/Appointment">
                        <ListItem className="text-white hover:text-black">
                            <ListItemPrefix className="mr-2">
                                <DocumentPlusIcon className="h-5 w-5 text-green-400" />
                            </ListItemPrefix>
                            <Typography>Registrar turno</Typography>
                        </ListItem>
                    </Link>
                    <Link to="/">
                        <ListItem className="text-white hover:text-black">
                            <ListItemPrefix className="mr-2">
                                <ClockIcon className="h-5 w-5 text-green-400" />
                            </ListItemPrefix>
                            <Typography>Turnos activos</Typography>
                        </ListItem>
                    </Link>
                    <Link to="/success">
                        <ListItem className="text-white hover:text-black">
                            <ListItemPrefix className="mr-2">
                                <CheckIcon className="h-5 w-5 text-green-400" />
                            </ListItemPrefix>
                            <Typography>Cirugías completadas</Typography>
                        </ListItem>
                    </Link>
                    <ListItem onClick={logout} className="text-white hover:text-black mt-auto">
                        <ListItemPrefix className="mr-2">
                            <PowerIcon className="h-5 w-5 text-red-500" />
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