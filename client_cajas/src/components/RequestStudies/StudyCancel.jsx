import { useEffect, useState } from "react"
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spinner,
    useDisclosure,
    Tooltip,
} from "@heroui/react"
import { Ban, AlertTriangle } from "lucide-react"
import useStudyOrderStore from "../../store/useStudyOrderStore"

const StudyCancel = ({ id, onUpdate }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { currentStudyOrder, fetchLastStudyOrders, fetchStudyOrderById, cancelStudyOrder, isLoadingStudyOrderStore } = useStudyOrderStore()
    const [isCancelling, setIsCancelling] = useState(false)

    useEffect(() => {
        if (isOpen && id) {
            fetchStudyOrderById(id)
        }
    }, [isOpen, id])

    const handleCancel = async () => {
        setIsCancelling(true)
        try {
            await cancelStudyOrder(id)
            await fetchLastStudyOrders()
            if (onUpdate) await onUpdate()
            onOpenChange(false)
        } catch (error) {
            console.error(error)
        } finally {
            setIsCancelling(false)
        }
    }

    const isSubmitted = currentStudyOrder?.status?.code === "SUBMITTED"

    return (
        <>
            <Tooltip content="Anular" color="danger">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    aria-label="Anular pedido"
                    onPress={onOpen}
                >
                    <Ban size={18} />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Anular Pedido #{id}
                            </ModalHeader>
                            <ModalBody>
                                {(isLoadingStudyOrderStore || !currentStudyOrder || currentStudyOrder.id !== id) ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Spinner label="Verificando estado..." color="danger" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 items-center text-center py-4">
                                        {isSubmitted ? (
                                            <>
                                                <div className="p-3 bg-danger-50 rounded-full text-danger">
                                                    <AlertTriangle size={40} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-default-900">¿Está seguro?</h3>
                                                    <p className="text-sm text-default-500 mt-1">
                                                        Esta acción anulará el pedido de forma permanente.
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-3 bg-default-100 rounded-full text-default-500">
                                                    <Ban size={40} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-default-900">No se puede anular</h3>
                                                    <p className="text-sm text-default-500 mt-1">
                                                        El pedido no se encuentra en estado "Enviado" (SUBMITTED).<br />
                                                        Estado actual: <span className="font-medium text-default-700">{currentStudyOrder.status?.name}</span>
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                {currentStudyOrder && !isLoadingStudyOrderStore && currentStudyOrder.id == id && isSubmitted && (
                                    <Button color="danger" onPress={handleCancel} isLoading={isCancelling}>
                                        Confirmar Anulación
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default StudyCancel