import {
    Banknote,
    Boxes,
    ChartColumnIncreasing ,
    ListOrdered,
    PersonStanding,
    SquareStack,
    Tablets
} from 'lucide-react'

export const ACCOUNTING_ITEMS = [
    {
        key: 'boxes',
        label: 'Mis cajas',
        icon: <SquareStack size={16} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant', 'admin']
    },
    {
        key: 'mainBoxes',
        label: 'Cajas generales',
        icon: <Boxes size={16} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant']
    },
    {
        key: 'accountingPanel',
        label: 'Panel de contabilidad',
        icon: <ChartColumnIncreasing  size={16} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant']
    }
]

export const CLINICAL_ITEMS = [
    {
        key: 'patients',
        label: 'Pacientes',
        icon: <PersonStanding size={16} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant', 'admin']
    },
    {
        key: 'practices',
        label: 'Practicas',
        icon: <ListOrdered size={16} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant', 'admin']
    },
    {
        key: 'diagnostics',
        label: 'Diagnosticos',
        icon: <Tablets size={16} strokeWidth={1.5} />,
        roles: ['superadmin']
    },
    {
        key: 'budgets',
        label: 'Presupuestos',
        icon: <Banknote size={16} strokeWidth={1.5} />,
        roles: ['superadmin']
    }
]
