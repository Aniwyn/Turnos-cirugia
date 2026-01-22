import { useNavigate } from 'react-router-dom'
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react"
import { House } from "lucide-react"

const BreadcrumbsLayout = ({ addresses = ["home", "budgets", "budgets_create"] }) => {
    const navigate = useNavigate()
    const LINKS = [
        {
            key: 'home',
            label: 'Home',
            adress: '/',
            icon: <House size={16} strokeWidth={1.5} />
        },
        {
            key: 'budgets',
            label: 'Presupuestos',
            adress: '/budgets'
        },
        {
            key: 'budgets_create',
            label: 'Crear',
            adress: '/budgets',
            icon: <House size={16} strokeWidth={1.5} />
        }
    ]

    return (
        <Breadcrumbs className="mb-4" underline="active" onAction={() => {}}>
            {addresses.map((address, index) => {
                const adressf = LINKS.find(link => link.key === address)
                return(
                    <BreadcrumbItem 
                        key={index}
                        onPress={() => navigate(adressf.adress)}
                        startContent={adressf.icon || null}
                        isCurrent={index === addresses.length - 1}
                        isDisabled={!adressf.adress}
                    >
                        {adressf.label}
                    </BreadcrumbItem>
                )
            })}
        </Breadcrumbs>
    )
}

export default BreadcrumbsLayout