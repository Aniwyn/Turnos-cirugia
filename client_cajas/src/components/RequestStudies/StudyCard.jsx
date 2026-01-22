import { useState } from "react"
import { Button, Card, CardBody, Tooltip } from "@heroui/react"
import { Vote } from "lucide-react"
import { formatShortDateFromDB, formatTimeFromDB, formatDNI } from '../../tools/utils'
import StudyCancel from './StudyCancel'
import StudyDetail from './StudyDetail'
import StudyPrint from './StudyPrint'
import useAuthStore from '../../store/useAuthStore'
import useStudyOrderStore from "../../store/useStudyOrderStore"

const getCardColor = (color) => {
    const colorMap = {
        red: "from-red-200",
        amber: "from-amber-200",
        green: "from-green-200"
    }
    return colorMap[color] || `from-${color}-100`
}

const getBorderCardColor = (color) => {
    const colorMap = {
        red: "border-red-500",
        amber: "border-amber-500",
        green: "border-green-500",
    }
    return colorMap[color] || `border-default-200`
}

const StudyCard = ({ study }) => {
    const [localStudy, setLocalStudy] = useState(null)
    const [isTaking, setIsTaking] = useState(false)
    const { user } = useAuthStore()
    const { takeStudyOrder, fetchStudyOrderById } = useStudyOrderStore()

    const displayStudy = localStudy || study

    const canTake = ['superadmin', 'researchtechnician'].includes(user?.role) && displayStudy.status?.code === "SUBMITTED"
    const canViewDetail = ['superadmin', 'secretary'].includes(user?.role) || (['superadmin', 'researchtechnician'].includes(user?.role) && displayStudy.status?.code !== "SUBMITTED")
    const canPrint = ['superadmin', 'researchtechnician'].includes(user?.role) && displayStudy.status?.code !== "SUBMITTED"
    const canCancel = ['superadmin', 'secretary'].includes(user?.role) && displayStudy.status?.code === "SUBMITTED"

    const handleTakeStudy = async () => {
        setIsTaking(true)
        try {
            const updatedOrder = await takeStudyOrder(study.id)
            if (updatedOrder) setLocalStudy(updatedOrder)
        } catch (error) {
            console.error("Error al tomar el pedido:", error)
        } finally {
            setIsTaking(false)
        }
    }

    const onUpdate = async () => {
        const updatedStudy = await fetchStudyOrderById(study.id)
        if (updatedStudy) setLocalStudy(updatedStudy)
    }

    if (!displayStudy) return null

    return (
        <Card shadow="sm" className={`border-s-5 rounded-s-none ${getBorderCardColor(displayStudy.status.tailwind_color)} bg-linear-to-r ${getCardColor(displayStudy.status.tailwind_color)} to-white`}>
            <CardBody className='flex flex-row gap-3 items-center p-3'>
                <div className='flex flex-col items-center px-2 border-r border-default-200 min-w-22.5'>
                    <span className='font-bold text-default-600'>{displayStudy.id}</span>
                    <span className='font-mono text-xs text-default-500'>{`${formatShortDateFromDB(displayStudy.created_at)} ${formatTimeFromDB(displayStudy.created_at)}`}</span>
                </div>
                <div className='flex flex-col grow overflow-hidden'>
                    <span className='font-semibold text-sm text-default-700 truncate'>{`${displayStudy.last_name || "SIN APELLIDO"}, ${displayStudy.first_name || "SIN NOMBRE"}`}</span>
                    <span className='text-xs text-default-500'>{displayStudy.dni ? formatDNI(displayStudy.dni) : "SIN DNI"}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                    {canTake &&
                        <Tooltip content="Tomar pedido">
                            <Button isIconOnly size="sm" variant="light" color="primary" aria-label="Tomar pedido" onPress={handleTakeStudy} isLoading={isTaking}>
                                <Vote size={18} />
                            </Button>
                        </Tooltip>
                    }
                    {canViewDetail && <StudyDetail id={displayStudy.id} onUpdate={onUpdate} />}
                    {canPrint && <StudyPrint id={displayStudy.id} />}
                    {canCancel && <StudyCancel id={displayStudy.id} onUpdate={onUpdate} />}
                </div>
            </CardBody>
        </Card>
    )
}

export default StudyCard