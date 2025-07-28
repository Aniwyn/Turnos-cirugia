import { create } from "zustand"
import { loginUser, checkUserAuth } from '../services/authService'

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),

    login: async (name, password) => {
        try {
            const { token, user } = await loginUser(name, password)

            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))

            set({ user, token, isAuthenticated: true })
        } catch (error) {
            const msg = error.response?.data?.message || 'Error de autenticación'
            console.error('Error en login:', msg)
            throw new Error(msg)
        }
    },

    logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        set({ user: null, token: null, isAuthenticated: false })
        window.location.href = "/login"
    },

    checkAuth: async () => {
        const token = localStorage.getItem("token")
        if (!token) return
        try {
            const { user } = await checkUserAuth()
            set({ user, token, isAuthenticated: true })
        } catch (error) {
            console.error("Error al verificar sesión:", error)
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            set({ user: null, token: null, isAuthenticated: false })
        }
    },
}))

export default useAuthStore