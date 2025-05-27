import { create } from "zustand"
import API from "../services/api"

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),

    login: async (name, password) => {
        try {
            const { data } = await API.post("/users/login", { name, password });
            const { token, user } = data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user))

            set({ user, token, isAuthenticated: true })
        } catch (error) {
            console.error("Error en login:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || "Error de autenticación");
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
        if (token) {
            try {
                const { data } = await API.get("/users/auth")
                set({ user: data.user, token, isAuthenticated: true })
            } catch (error) {
                console.error("Error al verificar sesión:", error)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                set({ user: null, token: null, isAuthenticated: false })
            }
        }
    },
}))

export default useAuthStore