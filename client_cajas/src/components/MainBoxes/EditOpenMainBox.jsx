import { Button, Tooltip } from "@heroui/react"
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react'

const EditOpenMainBox = () => {
    const navigate = useNavigate()

    const handleOpenMainBox = () => {
        navigate('/caja-general')
    }

    return (
        <Tooltip content="Editar">
            <Button isIconOnly variant="light" onPress={handleOpenMainBox} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <Pencil height={14} className="text-amber-600" />
            </Button>
        </Tooltip>
    )
}

export default EditOpenMainBox