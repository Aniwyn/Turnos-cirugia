import { Button } from '@heroui/button'
import { useNavigate } from 'react-router-dom'
import { Undo2 } from 'lucide-react'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col justify-center min-h-dvh bg-gradient-to-tl from-red-700 via-rose-800 to-purple-800">
            <div className="flex flex-col items-start ps-40 text-white">
                <h1 className="font-bold text-9xl">404</h1>
                <span className="font-medium text-4xl">Página no encontrada</span>
                
            </div>
            <div className='absolute top-0 left-0'>
                <Button
                    onPress={() => navigate(-1) || navigate('/')}
                    className="m-8 py-3 text-slate-200 bg-transparent hover:bg-white/20 rounded-xl backdrop-blur-md transition"
                    startContent={<Undo2 />}
                >
                    Regresar
                </Button>
            </div>
        </div>
    )
}

export default NotFound