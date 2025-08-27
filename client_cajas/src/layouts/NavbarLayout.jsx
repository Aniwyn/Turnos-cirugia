import useAuthStore from "../store/useAuthStore"
import { Link, Outlet } from 'react-router-dom'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react"
import { BanknoteArrowUp, ChevronDown, Eye, SquareStack } from 'lucide-react'

const NavbarLayout = () => {
  const { logout } = useAuthStore()

  const icons = {
    chevron: <ChevronDown size={16} />,
    scale: <BanknoteArrowUp size={30} />,
    activity: <SquareStack size={30} />
  }

  return (
    <>
      <Navbar>
        <NavbarBrand className="flex items-center">
          <Eye />
          <p className="font-bold text-inherit pl-2">Clínica de Ojos</p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button disableRipple className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base" endContent={icons.chevron} variant="flat">
                  Contabilidad
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label="ACME features" itemClasses={{ base: "gap-4" }}>
              <DropdownItem key="autoscaling" description='Cierre de caja' startContent={icons.scale}><Link to="/caja/cierre">Caja</Link></DropdownItem>
              <DropdownItem key="usage_metrics" description="Historial de cajas" startContent={icons.activity}><Link to="/caja/historial">Mis cajas</Link></DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Button disableRipple className="p-0 bg-transparent data-[hover=true]:bg-transparent text-base" endContent={icons.chevron} variant="flat">
                  Utilidades
                </Button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu aria-label="ACME features" itemClasses={{ base: "gap-4" }}>
              <DropdownItem key="autoscaling" startContent={icons.scale}><Link to="/caja/cierre">Presupuestos</Link></DropdownItem>
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
            <Button as={Link} onPress={logout} color="danger" href="#" variant="bordered">Cerrar sesión</Button>
            {/*
          <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
          */}
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