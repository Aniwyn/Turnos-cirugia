import { Link, Outlet, useNavigate } from 'react-router-dom'
import { 
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem
} from "@heroui/react"
import { 
    Banknote,
    BanknoteArrowUp,
    Boxes,
    ClipboardClock,
    ChevronDown,
    Eye,
    List,
    ListOrdered,
    Package,
    PersonStanding,
    Square,
    SquareStack,
    Tablets,
    Turntable
} from 'lucide-react'
import useAuthStore from "../store/useAuthStore"

const NavbarLayout = () => {
    const { logout } = useAuthStore()
    const navigate = useNavigate()

    const icons = {
        chevron: <ChevronDown size={16} />,
        scale: <BanknoteArrowUp size={30} />,
        activity: <SquareStack size={30} />,
        clipboardClock: <ClipboardClock size={30} />
    }
    const accountingDropdown = (key) => {
        switch (key) {
            case "box":
                navigate("/caja")
                break
            case "boxes":
                navigate("/cajas")
                break
            case "mainBox":
                navigate("/caja-general")
                break
            case "mainBoxes":
                navigate("/cajas-generales")
                break
            case "accountingPanel":
                navigate("/panel-contabilidad")
                break
            default:
                console.warn("Opción no manejada:", key)
        }
    }

    const clinicalManagementDropdown = (key) => {
        switch (key) {
            case "patients":
                navigate("/pacientes")
                break
            case "practices":
                navigate("/practicas")
                break
            case "budgets":
                navigate("/404")
                break
            case "diagnosticos":
                navigate("/404")
                break
            default:
                console.warn("Opción no manejada:", key)
        }
    }

    const utilsDropdown = (key) => {
        switch (key) {
            case "budgets":
                navigate("/presupuesto")
                break
            default:
                console.warn("Opción no manejada:", key)
        }
    }

    return (
        <div className='flex flex-col min-h-dvh'>
            <Navbar className='bg-gradient-to-tr from-emerald-600 to-lime-500 backdrop-blur-md text-base text-stone-100 font-semibold'>
                <NavbarBrand className="flex items-center">
                    <Eye />
                    <p className="font-bold text-inherit pl-2">Clínica de Ojos</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button disableRipple className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-stone-100 font-semibold" endContent={icons.chevron} variant="flat">
                                    Contabilidad
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            aria-label="ACME features"
                            onAction={(key) => accountingDropdown(key)}
                        >
                            <DropdownItem key="boxes" startContent={<SquareStack size={16} strokeWidth={1.5} />} >Mis cajas</DropdownItem>
                            <DropdownItem key="mainBoxes" startContent={<Boxes size={16} strokeWidth={1.5} />}>Cajas generales</DropdownItem>
                            <DropdownItem key="accountingPanel" startContent={<Square size={16} strokeWidth={1.5} />}>Panel de contabilidad</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button disableRipple className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-stone-100 font-semibold" endContent={icons.chevron} variant="flat">
                                    Gestion clínica
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            aria-label="ACME features"
                            // itemClasses={{ base: "gap-4" }}
                            onAction={(key) => clinicalManagementDropdown(key)}
                        >
                            <DropdownItem key="patients" startContent={<PersonStanding size={16} strokeWidth={1.5} />} >Pacientes</DropdownItem>
                            <DropdownItem key="practices" startContent={<ListOrdered size={16} strokeWidth={1.5} />} >Practicas</DropdownItem>
                            <DropdownItem key="diagnosticos" startContent={<Tablets size={16} strokeWidth={1.5} />} >Diagnosticos</DropdownItem>
                            <DropdownItem key="budgets" startContent={<Banknote size={16} strokeWidth={1.5} />} >Presupuestos</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    {/* BOORAR SI NO LO USO */}
                    <NavbarItem className="invisible">
                        <Link to="/Appointment">
                            Ejemplo 2 (?)
                        </Link>
                    </NavbarItem>

                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} onPress={logout} color="danger" href="#" variant="solid">Cerrar sesión</Button>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            {/* <main className="flex-1 py-4 px-8 bg-gradient-to-tl from-slate-100 via-gray-100 to-stone-100 "> */}
            <main className="flex-1 py-4 px-8">
                <Outlet />
            </main>
        </div>
    )
}

export default NavbarLayout