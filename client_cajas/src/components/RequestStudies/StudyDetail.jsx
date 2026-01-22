import { useEffect, useState, useRef } from "react"
import {
    Button,
    Chip,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Textarea,
    Tooltip,
    useDisclosure,
} from "@heroui/react"
import { Eye, CircleCheck, CheckCheck, Ban, AlertTriangle } from "lucide-react"
import useStudyOrderStore from "../../store/useStudyOrderStore"
import useAuthStore from '../../store/useAuthStore'
import { formatDateFromDB, formatTimeFromDB, formatDNI } from "../../tools/utils"
import useStudyOrderItemStore from "../../store/useStudyOrderItemStore"
import StudyDetailItem from "./StudyDetailItem"

const StudyDetail = ({ id, onUpdate }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { isOpen: isActionOpen, onOpen: onActionOpen, onOpenChange: onActionOpenChange } = useDisclosure()
    const { fetchStudyOrderById, currentStudyOrder, isLoadingStudyOrderStore } = useStudyOrderStore()
    const { completeStudyOrderItem, rejectStudyOrderItem, editStudyOrderItem, completeAllStudyOrderItems, rejectAllStudyOrderItems, isLoadingStudyOrderItemStore } = useStudyOrderItemStore()

    const [selectedItem, setSelectedItem] = useState(null)
    const [actionType, setActionType] = useState(null)
    const [justification, setJustification] = useState("")
    const fileInputRef = useRef(null)
    
    const { user } = useAuthStore()

    const getBgStatusColor = (color) => {
        const colorMap = {
            red: "bg-red-200",
            amber: "bg-amber-200",
            green: "bg-green-200",
            pink: "bg-pink-200",
            slate: "bg-sky-200",
        }
        return colorMap[color] || `bg-${color}-500`
    }

    const getTextStatusColor = (color) => {
        const colorMap = {
            red: "text-red-800",
            amber: "text-amber-800",
            green: "text-green-800",
            pink: "text-pink-800",
            slate: "text-slate-800",
        }
        return colorMap[color] || `bg-${color}-500`
    }

    useEffect(() => {
        if (isOpen && id) {
            fetchStudyOrderById(id)
        }
    }, [isOpen, id])

    const handleOpenAction = (item, type) => {
        setSelectedItem(item)
        setActionType(type)
        setJustification("")
        onActionOpen()
    }

    const handleSubmitAction = async () => {
        try {
            if (actionType === 'complete') {
                await completeStudyOrderItem(selectedItem.id)
            } else if (actionType === 'reject') {
                await rejectStudyOrderItem(selectedItem.id, justification)
            } else if (actionType === 'completeAll') {
                await completeAllStudyOrderItems(id)
            } else if (actionType === 'rejectAll') {
                await rejectAllStudyOrderItems(id, justification)
            } else if (actionType === 'edit') {
                await editStudyOrderItem(selectedItem.id)
            }
            await fetchStudyOrderById(id)
            if (onUpdate) await onUpdate()
            onActionOpenChange(false)
        } catch (error) {
            console.error(error)
        }
    }

    const canBulkAction = (
        // ['superadmin', 'researchtechnician'].includes(user?.role) &&
        ['superadmin'].includes(user?.role) &&
        (currentStudyOrder?.status?.code === "IN_PROGRESS" || currentStudyOrder?.status?.code === "PARTIALLY_COMPLETED")
    )

    return (
        <>
            <Tooltip content="Ver detalles">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    aria-label="Ver detalles"
                    onPress={onOpen}
                >
                    <Eye size={18} />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="mt-6">
                                {(isLoadingStudyOrderStore || !currentStudyOrder || currentStudyOrder.id !== id) ? (
                                    <div className="flex justify-center items-center py-10">
                                        <Spinner label="Cargando detalles..." color="primary" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-5">
                                        <div className="flex justify-between items-center bg-default-50 p-4 rounded-lg border border-default-100">
                                            <div className="flex gap-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-default-500 uppercase font-semibold">Pedido #</span>
                                                    <span className="text-sm font-medium text-default-700">
                                                        {id}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-default-500 uppercase font-semibold">Fecha de solcitud</span>
                                                    <span className="text-sm font-medium text-default-700">
                                                        {`${formatDateFromDB(currentStudyOrder.created_at)}`}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-default-500 uppercase font-semibold">Hora</span>
                                                    <span className="text-sm font-medium text-default-700">
                                                        {`${formatTimeFromDB(currentStudyOrder.created_at)}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs text-default-500 uppercase font-semibold">Estado</span>
                                                <Chip
                                                    variant="flat"
                                                    size="sm"
                                                    className={`${getBgStatusColor(currentStudyOrder.status.tailwind_color)} ${getTextStatusColor(currentStudyOrder.status.tailwind_color)}`}
                                                >
                                                    {currentStudyOrder.status?.name}
                                                </Chip>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-13 gap-6">
                                            <div className="flex flex-col gap-3 md:col-span-3">
                                                <h4 className="text-md font-bold text-default-800 flex items-center gap-2">
                                                    Datos del Paciente
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Nombre Completo</span>
                                                        <span className="font-medium text-default-700">
                                                            {currentStudyOrder.last_name}, {currentStudyOrder.first_name}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-default-500 block text-xs">DNI</span>
                                                        <span className="font-medium text-default-700">
                                                            {formatDNI(currentStudyOrder.dni)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Fecha de Nacimiento</span>
                                                        <span className="font-medium text-default-700">
                                                            {formatDateFromDB(currentStudyOrder.birth_date)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Email</span>
                                                        <span className="font-medium text-default-700">
                                                            {currentStudyOrder.email || "-"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Obra Social</span>
                                                        <span className="font-medium text-default-700">
                                                            {currentStudyOrder.healthInsurance?.name || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 md:col-span-3">
                                                <h4 className="text-md font-bold text-default-800">
                                                    Información Adicional
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Médico Solicitante</span>
                                                        <span className="font-medium text-default-700">
                                                            {currentStudyOrder.medic?.name || "-"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Generado por</span>
                                                        <span className="font-medium text-default-700 capitalize">
                                                            {currentStudyOrder.user?.name || "-"}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-default-500 block text-xs">Notas</span>
                                                        {currentStudyOrder.notes ? (
                                                            <div className="bg-yellow-50 border border-yellow-100 p-2 rounded text-default-600 italic mt-1">
                                                                {currentStudyOrder.notes || "Sin notas adicionales."}
                                                            </div>
                                                        ) : "-"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 md:col-span-7">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-md font-bold text-default-800">
                                                        Estudios Solicitados
                                                    </h4>
                                                    {canBulkAction && (
                                                        <div className="flex gap-2">
                                                            <Tooltip content="Marcar RESTANTES como completado">
                                                                <Button size="sm" color="success" variant="flat" onPress={() => handleOpenAction(null, 'completeAll')}>
                                                                    <CheckCheck size={16} />
                                                                    <span className="hidden sm:inline">Completar Todo</span>
                                                                </Button>
                                                            </Tooltip>
                                                            <Tooltip content="Marcar RESTANTES como no realizado">
                                                                <Button size="sm" color="danger" variant="flat" onPress={() => handleOpenAction(null, 'rejectAll')}>
                                                                    <Ban size={16} />
                                                                    <span className="hidden sm:inline">Rechazar Todo</span>
                                                                </Button>
                                                            </Tooltip>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {currentStudyOrder.items?.map((item) => (
                                                        <StudyDetailItem key={item.id} item={item} user={user} studyStatus={currentStudyOrder.status} onAction={handleOpenAction} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <Divider />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isActionOpen} onOpenChange={onActionOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {actionType === 'edit' ? "Editar Estudio" : (actionType === 'complete' || actionType === 'completeAll') ? "Completar Estudio(s)" : "Rechazar Estudio(s)"}
                            </ModalHeader>
                            <ModalBody>
                                <p className="font-semibold text-default-900 text-center">
                                    {selectedItem?.study?.name || (actionType?.includes('All') ? "Todos los estudios pendientes" : "")}
                                </p>
                                {(actionType === 'complete' || actionType === 'completeAll') ? (
                                    <div className="flex flex-col gap-4 items-center text-center py-4">
                                        <div className="p-3 bg-success-50 rounded-full text-success">
                                            <CircleCheck size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-default-900">
                                                ¿Confirmar estudio realizado?
                                            </h3>
                                            <p className="text-sm text-default-500 mt-1">
                                                {actionType === 'completeAll' ? "Se marcarán todos los items pendientes como realizados." : "Al confirmar, el estudio quedará marcado como realizado."}
                                            </p>
                                        </div>
                                    </div>
                                ) : actionType === 'edit' ? (
                                    <div className="flex flex-col gap-4 items-center text-center py-4">
                                        <div className="p-3 bg-warning-50 rounded-full text-warning">
                                            <AlertTriangle size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-default-900">
                                                ¿Desea editar este estudio?
                                            </h3>
                                            <p className="text-sm text-default-500 mt-1">
                                                Esta acción permitirá modificar los detalles del estudio y generar un reporte de edicíon.
                                            </p>
                                            {/* <Textarea
                                                label="Justificación"
                                                placeholder="Ingrese el motivo por el cual no se realizó el estudio..."
                                                value={justification}
                                                onValueChange={setJustification}
                                                variant="bordered"
                                            /> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <Textarea
                                            label="Justificación"
                                            placeholder="Ingrese el motivo por el cual no se realizó el estudio..."
                                            value={justification}
                                            onValueChange={setJustification}
                                            variant="bordered"
                                        />
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSubmitAction}
                                    isDisabled={(actionType === 'complete' || actionType === 'completeAll' || actionType === 'edit') ? null : !justification.trim()}
                                    isLoading={isLoadingStudyOrderItemStore}
                                >
                                    Confirmar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    )
}

export default StudyDetail