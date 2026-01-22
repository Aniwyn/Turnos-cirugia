import { Card, CardBody } from "@heroui/react"
import { useNavigate } from "react-router-dom"
import { Users, Wallet, Calculator, Microscope, Activity } from "lucide-react"
import useAuthStore from "../store/useAuthStore"
import { capitalizeFirstLetter } from '../tools/utils'

const Home = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    const menuItems = [
        {
            title: "Pacientes",
            description: "Administración de historias clínicas y datos.",
            icon: <Users size={40} className="text-blue-600" />,
            route: "/pacientes",
            bg: "bg-linear-to-br from-white to-blue-300/35",
            hover: "hover:bg-blue-100",
            users: ['superadmin', 'admin', 'accountant', 'nurse']
        },
        {
            title: "Caja",
            description: "Gestión de movimientos y cierres de caja.",
            icon: <Wallet size={40} className="text-emerald-600" />,
            route: "/caja",
            bg: "bg-linear-to-br from-white to-emerald-300/35",
            hover: "hover:bg-emerald-100",
            users: ['superadmin', 'admin', 'accountant']
        },
        {
            title: "Presupuestos",
            description: "Creación y consulta de presupuestos.",
            icon: <Calculator size={40} className="text-orange-600" />,
            route: "/presupuestos",
            bg: "bg-linear-to-br from-white to-orange-300/35",
            hover: "hover:bg-orange-100",
            users: ['superadmin', 'admin', 'accountant']
        },
        {
            title: "Pedidos de Estudios",
            description: "Solicitudes de estudios médicos.",
            icon: <Microscope size={40} className="text-purple-600" />,
            route: "/pedidos-estudios",
            bg: "bg-linear-to-br from-white to-purple-300/35",
            hover: "hover:bg-purple-100",
            users: ['superadmin', 'admin', 'accountant', 'nurse', 'researchtechnician', 'secretary']
        }
    ]

    return (
        <div className="flex flex-col w-full h-full p-6 gap-8 max-w-7xl mx-auto animate-appearance-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-linear-to-r from-white to-primary/5 flex flex-col md:flex-row md:col-span-2 justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100/50">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Hola, <span className="text-primary">{capitalizeFirstLetter(user?.name) || "Usuario"}</span>
                        </h1>
                        <p className="text-gray-500 text-lg">¡Bienvenido/a, esperamos que tengas un excelente día!</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <img
                            src="/logo_prisma.png"
                            alt="Logo Institucional"
                            className="h-16 md:h-20 opacity-90"
                        />
                    </div>
                </div>

                <Card className="bg-white border border-gray-100 shadow-sm">
                    <CardBody className="p-6 flex flex-col justify-center items-center text-center gap-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha Actual</p>
                        <p className="text-2xl font-bold text-gray-700 capitalize">
                            {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {menuItems.filter(item => item.users.includes(user?.role)).map((item, index) => (
                    <Card
                        key={index}
                        isPressable
                        onPress={() => navigate(item.route)}
                        className="border-none shadow-sm hover:shadow-lg transition-all duration-300 h-full"
                    >
                        <CardBody className={`flex flex-col items-center justify-center p-8 gap-4 ${item.bg} ${item.hover} transition-colors`}>
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                {item.icon}
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-gray-700">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Home