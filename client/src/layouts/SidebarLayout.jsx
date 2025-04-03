import { Button, Typography } from "@material-tailwind/react"
import { Link } from "react-router-dom"
import useAuthStore from "../store/authStore";

const SidebarLayout = ({ children }) => {
    const { user, logout } = useAuthStore();

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4">
                <Typography variant="h3" className="font-bold">Clínica</Typography>
                <Typography variant="h4">{ user.name }</Typography>
                <Typography variant="h4">{ user.role }</Typography>
                <nav>
                    <ul>
                        <li>
                            <Link to="/" className="block py-2">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/Appointment" className="block py-2">Registro</Link>
                        </li>
                        <li>
                            <Link to="/Login" className="block py-2">Login</Link>
                        </li>
                        <li>
                            <Link to="/NotFound" className="block py-2">404</Link>
                        </li>
                    </ul>
                </nav>
                <Button onClick={logout}>Cerrar sesión</Button>
            </aside>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default SidebarLayout;