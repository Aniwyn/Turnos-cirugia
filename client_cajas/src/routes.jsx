import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import CashBox from './pages/CashBox'
import MyCashClosures from './pages/MyCashClosures'
import DailySummary from './pages/DailySummary'
import DailySummaryDashboard from './pages/DailySummaryDashboard'
import Budget from './pages/Budget'
import Budgets from './pages/Budgets'
import Patients from './pages/Patients'
import Practices from './pages/Practices'
import Patient from './pages/Patient'
import PatientProfile from './pages/PatientProfile'
import NavbarLayout from './layouts/NavbarLayout'
//import NotFound from "./pages/NotFound"
import useAuthStore from "./store/useAuthStore"

import TEST from "./pages/TEST"
import TEST2 from "./pages/SuppliesStamps"

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

    if (loading) return <div>Cargando...</div>
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
                        <Route path="/" element={<MyCashClosures />} />
                        <Route path="/caja/cierre" element={<CashBox />} />
                        <Route path="/caja/historial" element={<MyCashClosures />} />
                        <Route path="/cierre_de_caja" element={<DailySummary />} />
                        <Route path="/dashboard/cierres_de_caja" element={<DailySummaryDashboard />} />
                        <Route path="/presupuesto" element={<Budget />} />
                        <Route path='/presupuesto/:id' element={<Budget />} />
                        <Route path='/pacientes' element={<Patients />} />
                        <Route path='/practicas' element={<Practices />} />
                        <Route path='/pacientes/crear' element={<Patient />} />
                        <Route path='/pacientes/actualizar/:id' element={<Patient />} />
                        <Route path='/presupuestos' element={<Budgets />} />
                        <Route path='/pacientes/perfil/:id' element={<PatientProfile />} />
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />

                {/* SIN RUTAS PRIVADAS, SOLO DESARROLLO */}
                <Route element={<NavbarLayout />}>
                    <Route path="/test" element={<TEST />} />
                    <Route path="/test2" element={<TEST2 />} />
                </Route>

                {/*<Route path="*" element={<NotFound />} />*/}
            </Routes>
        </Router>
    )
}

export default AppRoutes