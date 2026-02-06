import { useEffect, useState } from "react"
import {
    addToast,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    useDisclosure,
} from "@heroui/react"
import { Printer } from "lucide-react"
import useStudyOrderStore from "../../store/useStudyOrderStore"
import { printTicketAgent } from "../../tools/generateStudyOrderTicketESCPOS"

const StudyPrint = ({ id }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { currentStudyOrder, fetchStudyOrderById, isLoadingStudyOrderStore } = useStudyOrderStore()
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        if (isOpen && id) {
            fetchStudyOrderById(id)
        }
    }, [isOpen, id])

    const getEyeName = (eye) => {
        const eyeMap = {
            BOTH: "",
            LEFT: "OI",
            RIGHT: "OD",
        }
        return eyeMap[eye] || `ERROR`
    }

    const handlePrint = async () => {
        if (!currentStudyOrder) return
        setIsGenerating(true)
        try {
            const pdfData = {
                ...currentStudyOrder,
                patient_last_name: currentStudyOrder.last_name,
                patient_first_name: currentStudyOrder.first_name,
                patient_dni: currentStudyOrder.dni,
                patient_dob: currentStudyOrder.birth_date,
                health_insurance_name: currentStudyOrder.healthInsurance?.name,
                doctor_name: currentStudyOrder.medic?.name,
                observations: currentStudyOrder.notes,
                items: currentStudyOrder.items?.map(item => ({
                    description: item.study?.name || item.description,
                    eye: getEyeName(item.eye)
                })) || [],
                date: currentStudyOrder.created_at
            }
            await printTicketAgent(pdfData)
            onOpenChange(false)
        } catch (error) {
            console.error("Error generating PDF:", error)
            addToast({
                title: "Error de impresión",
                description: error.message || "No se pudo conectar con la impresora",
                color: "danger"
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <>
            <Button
                isIconOnly
                size="sm"
                variant="light"
                color="secondary"
                aria-label="Imprimir ticket"
                onPress={onOpen}
            >
                <Printer size={18} />
            </Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Imprimir Ticket de Orden #{id}
                            </ModalHeader>
                            <ModalBody>
                                {(isLoadingStudyOrderStore || !currentStudyOrder || currentStudyOrder.id != id) ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Spinner label="Cargando datos..." color="secondary" />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 items-center text-center py-4">
                                        <div className="p-3 bg-secondary-50 rounded-full text-secondary">
                                            <Printer size={40} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-default-900">¿Desea imprimir el ticket?</h3>
                                            <p className="text-sm text-default-500 mt-1">
                                                Se enviará la orden directamente a la impresora térmica.
                                            </p>
                                        </div>
                                        <div className="w-full bg-default-50 p-3 rounded-lg text-left text-sm border border-default-200">
                                            <p><strong>Paciente:</strong> {currentStudyOrder.last_name}, {currentStudyOrder.first_name}</p>
                                            <p><strong>DNI:</strong> {currentStudyOrder.dni}</p>
                                            <p><strong>Estudios:</strong> {currentStudyOrder.items?.length || 0}</p>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                {currentStudyOrder && currentStudyOrder.id == id && (
                                    <Button 
                                        color="secondary" 
                                        onPress={handlePrint} 
                                        isLoading={isGenerating}
                                        isDisabled={isLoadingStudyOrderStore}
                                    >
                                        Imprimir Ticket
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

export default StudyPrint