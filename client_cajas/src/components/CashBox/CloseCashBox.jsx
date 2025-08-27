import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Divider,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react"
import { CopyCheck, NotebookPen } from 'lucide-react'
import useCashBoxStore from "../../store/useCashBoxStore"
import useCashMovementStore from "../../store/useCashMovementStore"

const CreateCashBox = ({ summary, boxName, setBoxName, boxId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { closeBox, isLoading } = useCashBoxStore()
    const { fetchCashMovements } = useCashMovementStore()
    const [sending, setSending] = useState(false)
    const navigate = useNavigate();

    const formatter = (number) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    const submit = async (onClose) => {
        if (!boxName.trim()) {
            alert("Ingresá una descripción para el cierre.")
            return
        }

        setSending(true)
        try {
            await closeBox(boxId, boxName.trim())
            onClose?.()
        } catch (e) {
            alert(e.message)
        } finally {
            setSending(false)
            await fetchCashMovements()
            onClose()
        }
        navigate('/')
    }

    return (
        <>
            <Button color="success" variant="flat" endContent={<CopyCheck height={20} />} onPress={onOpen}>Cerrar caja</Button>
            <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
                <ModalContent className="border-3 border-green-600">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">¿Esta seguro/a que desea cerrar la caja?</ModalHeader>
                            <ModalBody>
                                <Input
                                    startContent={<NotebookPen size={20} color="#a1a1ab" strokeWidth={2} />}
                                    label="Nombre de la caja"
                                    value={boxName}
                                    onValueChange={setBoxName}
                                    isClearable
                                />
                                <Divider className="my-3" />
                                <div className="flex justify-between px-5 items-center">
                                    <span className="text-4xl pr-4">Total ARS</span>
                                    <span className="text-4xl font-thin" style={{ color: summary?.ARS < 0 ? "#c10007" : "#008236" }}>{summary?.ARS ? formatter(summary.ARS) : "0"}</span>
                                </div>
                                <div className="flex justify-between px-5 items-center">
                                    <span className="text-4xl pr-4">Total USD</span>
                                    <span className="text-4xl font-thin" style={{ color: summary?.USD < 0 ? "#c10007" : "#008236" }}>{summary?.USD ? formatter(summary.USD) : "0"}</span>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>Cerrar</Button>
                                <Button color="success" onPress={() => submit(onClose)} disabled={sending || isLoading}>
                                    {sending ? "Cerrando..." : "Cerrar caja"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateCashBox