import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react"
import { ClipboardClock, BanknoteArrowUp, ChevronDown, Eye, SquareStack } from 'lucide-react'
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
                navigate("/caja/cierre")
                break
            case "my_boxes":
                navigate("/caja/historial")
                break
            case "close_boxes":
                navigate("/cierre_de_caja")
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
        <>
            <Navbar className='bg-gradient-to-tr from-lime-500 to-green-400 backdrop-blur-md text-base text-stone-100 font-semibold'>
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
                        <DropdownMenu aria-label="ACME features" itemClasses={{ base: "gap-4" }} onAction={(key) => accountingDropdown(key)} >
                            <DropdownItem
                                key="box"
                                description='Cierre de caja'
                                startContent={icons.scale}
                            >
                                Caja
                            </DropdownItem>
                            <DropdownItem
                                key="my_boxes"
                                description="Historial de cajas"
                                startContent={icons.activity}
                            >
                                Mis cajas
                            </DropdownItem>
                            <DropdownItem
                                key="close_boxes"
                                description="Historial de cajas"
                                startContent={icons.clipboardClock}
                                
                            >
                                Cierre de cajas
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button disableRipple className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-stone-100 font-semibold" endContent={icons.chevron} variant="flat">
                                    Utilidades
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu aria-label="ACME features" itemClasses={{ base: "gap-4" }} onAction={(key) => utilsDropdown(key)} >
                            <DropdownItem
                                key="budgets"
                                startContent={icons.scale}
                            >
                                Presupuestos
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <NavbarItem>
                        <Link to="/pacientes">
                            Pacientes
                        </Link>
                    </NavbarItem>

                    <NavbarItem>
                        <Link to="/practicas">
                            Practicas
                        </Link>
                    </NavbarItem>

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
            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </>
    )
}

export default NavbarLayout