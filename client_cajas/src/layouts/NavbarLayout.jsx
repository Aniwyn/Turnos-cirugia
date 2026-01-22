import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
    Avatar,
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
    BanknoteArrowUp,
    ClipboardClock,
    ChevronDown,
    SquareStack,
    LogOut
} from 'lucide-react'
import useAuthStore from "../store/useAuthStore"
import { ACCOUNTING_ITEMS, CLINICAL_ITEMS } from '../config/navigation'
import { capitalizeFirstLetter, userCanSeeItem } from '../tools/utils'


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
            case "requestsStudies":
                navigate("/pedidos-estudios")
                break
            default:
                console.warn("Opción no manejada:", key)
        }
    }

    //                 class="absolute -left-[0.05em] -right-[0.05em] -bottom-[0.18em] h-[0.22em] rounded-full
    //  bg-[linear-gradient(90deg,#00D4FF_0%,#2DE2A6_22%,#A6FF4D_40%,#FFD24A_58%,#FF5AA5_78%,#8B5CFF_100%)]
    //  opacity-[0.85] blur-[0.25px]"

    return (
        <div className='flex flex-col min-h-dvh bg-slate-50'>
            <Navbar className='bg-white border-b border-slate-200' maxWidth="full" isBordered>
                <NavbarBrand>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                        <img src="/logo_prisma.png" alt="Logo Prisma" className="h-10 w-auto object-contain" />
                        <div class="inline-flex flex-col gap-1 font-sans tracking-[0.02em] max-w-[220px]">
                        <div class="relative inline-block">
                            <span
                                class="relative text-[2rem] leading-none font-extrabold
                               tracking-[0.08em] uppercase text-[#1d2431]
                               [text-shadow:0_1px_0_rgba(255,255,255,0.35)]"
                            >
                                PRISMA
                            </span>
                            <span
                                class="absolute -left-[0.05em] -right-[0.05em] -bottom-[0.18em] h-[0.22em] rounded-full
                               bg-[linear-gradient(90deg,#00D4FF_0%,#2DE2A6_22%,#A6FF4D_40%,#FFD24A_58%,#FF5AA5_78%,#8B5CFF_100%)]
                               opacity-[0.85] blur-[0.25px]"
                                aria-hidden="true"
                            ></span>
                        </div>
                        </div>
                    </div>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-8 w-max" justify="center">
                    {hasAccountingAccess && (
                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-slate-600 font-medium hover:text-sky-600 transition-colors"
                                        endContent={<ChevronDown size={16} className="text-slate-400" />}
                                        variant="light"
                                        radius="none"
                                    >
                                        Contabilidad
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="Contabilidad"
                                onAction={(key) => accountingDropdown(key)}
                                className="w-85"
                                itemClasses={{
                                    base: "gap-4",
                                }}
                            >
                                {visibleAccountingItems.map(item => (
                                    <DropdownItem
                                        key={item.key}
                                        startContent={<span className="text-slate-500">{item.icon}</span>}
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
                                        className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base text-slate-600 font-medium hover:text-sky-600 transition-colors"
                                        endContent={<ChevronDown size={16} className="text-slate-400" />}
                                        variant="light"
                                        radius="none"
                                    >
                                        Gestión clínica
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="Gestión clínica"
                                onAction={(key) => clinicalManagementDropdown(key)}
                                className="w-[340px]"
                                itemClasses={{
                                    base: "gap-4",
                                }}
                            >
                                {visibleClinicalItems.map(item => (
                                    <DropdownItem
                                        key={item.key}
                                        startContent={<span className="text-slate-500">{item.icon}</span>}
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
                    <Dropdown placement="bottom-end">
                        <NavbarItem className="bg-gray-100/50 hover:bg-gray-100 py-2 px-6 rounded-full">
                            <DropdownTrigger>
                                <div className="flex items-center gap-3 cursor-pointer ">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-sm font-semibold text-slate-700">{capitalizeFirstLetter(user?.name) || 'Usuario'}</span>
                                        <span className="text-xs text-slate-500 capitalize">{user?.role_name || 'Rol'}</span>
                                    </div>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="primary"
                                        name={user?.name}
                                        size="sm"
                                        src={user?.avatar}
                                    />

                                </div>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu aria-label="Acciones de usuario" variant="flat">
                            <DropdownItem key="logout" color="danger" onPress={logout} startContent={<LogOut size={18} />} textValue="Cerrar sesión">
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
            </Navbar>
            <main className="flex-1 py-6 px-4 md:px-8 max-w-400 mx-auto w-full">
                <Outlet />
            </main>
        </div>
    )
}

export default NavbarLayout