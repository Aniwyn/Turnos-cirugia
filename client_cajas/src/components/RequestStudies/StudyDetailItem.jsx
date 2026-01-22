import { Button, Chip, Tooltip } from "@heroui/react"
import { Check, X, SquarePen, View } from "lucide-react"

const getStatusDotColor = (color) => {
    const colorMap = {
        red: "bg-red-500",
        amber: "bg-amber-500",
        green: "bg-green-500",
        pink: "bg-pink-500",
        slate: "bg-slate-500",
    }
    return colorMap[color] || `bg-${color}-500`
}

const StudyDetailItem = ({ item, user, studyStatus, onAction }) => {
    // const canComplete = ['superadmin', 'researchtechnician'].includes(user?.role) && item.status?.code === "PENDING" && (studyStatus.code === "IN_PROGRESS" || studyStatus.code === "PARTIALLY_COMPLETED")
    const canComplete = ['superadmin'].includes(user?.role) && item.status?.code === "PENDING" && (studyStatus.code === "IN_PROGRESS" || studyStatus.code === "PARTIALLY_COMPLETED")
    const canSeeObservations = item.status?.code === "NOT_PERFORMED"
    const isRecent = item.updated_at ? (new Date() - new Date(item.updated_at)) < 24 * 60 * 60 * 1000 : false
    const canEdit = ['superadmin', 'researchtechnician'].includes(user?.role) && (item.status?.code === "DONE" || item.status?.code === "NOT_PERFORMED") && isRecent

    return (
        <div className="grid grid-cols-5 justify-between items-center p-1 rounded-lg border border-default-200 bg-white hover:bg-default-50 transition-colors">
            <div className="col-span-1 flex gap-1 justify-center items-center">
                {canComplete && (
                    <>
                        <Tooltip content="Marcar como completado">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="success"
                                onPress={() => onAction(item, 'complete')}
                            >
                                <Check size={18} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Marcar como no realizado">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => onAction(item, 'reject')}
                            >
                                <X size={18} />
                            </Button>
                        </Tooltip>
                    </>
                )}
                {canSeeObservations && (
                    <Tooltip
                    placement="left-start"
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">Motivo</div>
                                <div className="text-tiny">{item.justification || "Sin justificación"}</div>
                            </div>
                        }
                    >
                        <View size={18} color="#f6339a" />
                    </Tooltip>
                )}
                {canEdit && (
                    <Tooltip content="Editar estudio">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="warning"
                            onPress={() => onAction(item, 'edit')}
                        >
                            <SquarePen size={18} />
                        </Button>
                    </Tooltip>
                )}
            </div>

            <span className="col-span-3 text-sm font-medium text-default-700">
                {item.study?.name}
            </span>

            <div className="col-span-1 flex items-center gap-3">
                {
                    item.status &&
                    <Chip
                        size="sm"
                        variant="dot"
                        className="border-none"
                        classNames={{
                            dot: getStatusDotColor(item.status?.tailwind_color)
                        }}
                    >
                        {item.status?.name}
                    </Chip>
                }
            </div>
        </div>
    )
}

export default StudyDetailItem