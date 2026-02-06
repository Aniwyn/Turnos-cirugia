import {
    Banknote,
    Boxes,
    ChartColumnIncreasing,
    HeartPulse,
    ListOrdered,
    PersonStanding,
    SquareStack,
    Tablets
} from 'lucide-react'

export const ACCOUNTING_ITEMS = [
    {
        key: 'boxes',
        label: 'Mis cajas',
        icon: <SquareStack size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant', 'admin']
    },
    {
        key: 'mainBoxes',
        label: 'Cajas generales',
        icon: <Boxes size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant']
    },
    {
        key: 'accountingPanel',
        label: 'Panel de contabilidad',
        icon: <ChartColumnIncreasing  size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant']
    }
]

export const CLINICAL_ITEMS = [
    {
        key: 'patients',
        label: 'Pacientes',
        icon: <PersonStanding size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant', 'admin']
    },
    {
        key: 'practices',
        label: 'Practicas',
        icon: <ListOrdered size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'accountant', 'admin']
    },
    {
        key: 'diagnostics',
        label: 'Diagnosticos',
        icon: <Tablets size={18} strokeWidth={1.5} />,
        roles: ['superadmin']
    },
    {
        key: 'budgets',
        label: 'Presupuestos',
        icon: <Banknote size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'admin']
    },
    {
        key: 'requestsStudies',
        label: 'Solicitudes de estudios',
        icon: <Tablets size={18} strokeWidth={1.5} />,
        roles: ['superadmin', 'researchtechnician', 'secretary', 'admin']
    },
    {
        key: 'surgeryAppointments',
        label: 'Cirugias',
        icon: <HeartPulse size={18} strokeWidth={1.5} />,
        roles: ['superadmin']
    }
]
