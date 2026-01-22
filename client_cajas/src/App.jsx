import AppRoutes from "./routes"
import { HeroUIProvider } from "@heroui/react"
import { ToastProvider } from "@heroui/toast"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider locale="es-AR">
                <ToastProvider />
                <AppRoutes />
            </HeroUIProvider>
        </QueryClientProvider>
    )
}

export default App