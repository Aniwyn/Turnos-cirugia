import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import DashboardSuccess from './pages/DashboardSuccess'
import Login from "./pages/Login"
import Appointment from "./pages/Appointment"
import EditAppointment from "./pages/EditAppointment"
import NotFound from "./pages/NotFound"
import LoadingScreen from "./layouts/LoadingScreen"
import useAuthStore from "./store/authStore"

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
                <Route element={<PrivateRoute><Outlet/></PrivateRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/success" element={<DashboardSuccess />} />
                    <Route path="/appointment" element={<Appointment />} />
                    <Route path="/appointment-edit" element={<EditAppointment />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />

                {/* BORRAR, SOLO TEST */}
                <Route path="/load" element={<LoadingScreen />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes