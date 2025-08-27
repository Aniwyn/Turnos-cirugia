import AppRoutes from "./routes"
import { HeroUIProvider } from "@heroui/react"

function App() { 
    return (
        <HeroUIProvider locale="es-AR">
            <AppRoutes/>
        </HeroUIProvider> 
    )
}

export default App