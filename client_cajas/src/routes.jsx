import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"

import NavbarLayout from './layouts/NavbarLayout'

import AccountingPanel from './pages/AccountingPanel'
import SurgeryAppointments from './pages/SurgeryAppointments'
import Budget from './pages/Budget'
import Budgets from './pages/Budgets'
import CashBox from './pages/CashBox'
import CashBoxes from './pages/CashBoxes'
import Home from "./pages/Home"
import ISJRec from './pages/utils/ISJRec'
import LoadingPage from './pages/LoadingPage'
import Login from "./pages/Login"
import MainBox from './pages/MainBox'
import MainBoxes from './pages/MainBoxes'
import NotFound from './pages/NotFound'
import Patient from './pages/Patient'
import PatientProfile from './pages/PatientProfile'
import Patients from './pages/Patients'
import Practices from './pages/Practices'
import PendingRequestedStudies from './pages/PendingRequestedStudies'
import RequestStudies from './pages/RequestStudies'
import RequestStudyCreate from './pages/RequestStudyCreate'
import TEST from "./pages/TEST"
import TEST2 from "./pages/SuppliesStamps"

import useAuthStore from "./store/useAuthStore"

const PrivateRoute = () => {
    const { isAuthenticated, checkAuth } = useAuthStore()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth()
            setLoading(false)
        }

        verifyAuth()
    }, [checkAuth])

    if (loading) return <LoadingPage />
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

const AppRoutes = () => {
    const { checkAuth } = useAuthStore()
    useEffect(() => { checkAuth() }, [])

    return (
        <Router>
            <Routes>
                <Route element={<PrivateRoute> <Outlet /> </PrivateRoute>}>
                    <Route element={<NavbarLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/caja" element={<CashBox />} />
                        <Route path="/cajas" element={<CashBoxes />} />
                        <Route path="/caja-general" element={<MainBox />} />
                        <Route path="/cajas-generales" element={<MainBoxes />} />

                        <Route path="/presupuesto" element={<Budgets />} />
                        <Route path="/presupuesto/crear" element={<Budget />} />
                        <Route path='/presupuesto/:id' element={<Budget />} />
                        <Route path='/pacientes' element={<Patients />} />
                        <Route path='/practicas' element={<Practices />} />
                        <Route path='/pacientes/crear' element={<Patient />} />
                        <Route path='/pacientes/actualizar/:id' element={<Patient />} />
                        <Route path='/presupuestos' element={<Budgets />} />
                        <Route path='/pacientes/perfil/:id' element={<PatientProfile />} />
                        <Route path="/panel-contabilidad" element={<AccountingPanel />} />

                        <Route path="/pedidos-estudios" element={<RequestStudies />} />
                        <Route path="/pedidos-estudios/crear" element={<RequestStudyCreate />} />
                        <Route path="/pedidos-estudios/pendientes" element={<PendingRequestedStudies />} />

                        <Route path="/turnos/cirugias" element={<SurgeryAppointments />} />
                    </Route>
                </Route>

                <Route path="/404" element={<NotFound />} />

                <Route path="/login" element={<Login />} />
                <Route path='/ISJ' element={<ISJRec />} />
                <Route path='/loading' element={<LoadingPage />} />

                {/* SIN RUTAS PRIVADAS, SOLO DESARROLLO */}
                <Route element={<NavbarLayout />}>
                    <Route path="/test" element={<TEST />} />
                    <Route path="/test2" element={<TEST2 />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes