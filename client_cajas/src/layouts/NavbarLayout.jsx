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
import { ACCOUNTING_ITEMS, CLINICAL_ITEMS } from '../config/navigation'
import { userCanSeeItem } from '../tools/utils'
import { useEffect } from 'react'


const NavbarLayout = () => {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const userRole = user?.role
    const userRoleGroup = user?.role_group

    const visibleAccountingItems = ACCOUNTING_ITEMS.filter(item =>
        userCanSeeItem(item, userRole, userRoleGroup)
    )

    const visibleClinicalItems = CLINICAL_ITEMS.filter(item =>
        userCanSeeItem(item, userRole, userRoleGroup)
    )

    const hasAccountingAccess = visibleAccountingItems.length > 0
    const hasClinicalAccess = visibleClinicalItems.length > 0

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
                navigate("/presupuestos")
                break
            case "diagnostics":
                navigate("/404")
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
                    {hasAccountingAccess && (
                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-stone-100 font-semibold"
                                        endContent={icons.chevron}
                                        variant="flat"
                                    >
                                        Contabilidad
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="Contabilidad"
                                onAction={(key) => accountingDropdown(key)}
                            >
                                {visibleAccountingItems.map(item => (
                                    <DropdownItem
                                        key={item.key}
                                        startContent={item.icon}
                                    >
                                        {item.label}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}

                    {hasClinicalAccess && (
                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-stone-100 font-semibold"
                                        endContent={icons.chevron}
                                        variant="flat"
                                    >
                                        Gestion clínica
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="Gestión clínica"
                                onAction={(key) => clinicalManagementDropdown(key)}
                            >
                                {visibleClinicalItems.map(item => (
                                    <DropdownItem
                                        key={item.key}
                                        startContent={item.icon}
                                    >
                                        {item.label}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}

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