import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import Login from "./pages/Login"
import TEST from "./pages/TEST"
import TEST2 from "./pages/SuppliesStamps"
import Home from "./pages/Home"
import CashBox from './pages/CashBox'
import MyCashClosures from './pages/MyCashClosures'
import DailySummary from './pages/DailySummary'
import DailySummaryDashboard from './pages/DailySummaryDashboard'
import NavbarLayout from './layouts/NavbarLayout'
//import NotFound from "./pages/NotFound"
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
                    </Route>
                </Route>

                <Route path="/login" element={<Login />} />

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