import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip,
    useDisclosure,
} from "@heroui/react"
import { CopyCheck } from 'lucide-react'

const CreateCashBox = ({ summary }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const formatter = (number) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
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
                                <Button color="success" onPress={onClose}>Confirmar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateCashBox