import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Appointment from "./pages/Appointment"
import NotFound from "./pages/NotFound"
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
                <Route element={<PrivateRoute><Outlet /></PrivateRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/appointment" element={<Appointment />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
