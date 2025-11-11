import {
    Button,
    Form,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Tooltip,
    useDisclosure,
} from "@heroui/react"
import { Unlink } from 'lucide-react'
import useCashBoxStore from '../../store/useCashBoxStore'
import { formatCurrency, formatDateFromDB, capitalizeFirstLetter } from '../../tools/utils'

const UnlinkCashBoxForMainBox = ({ box, fetchMainBox }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { unlinkMainBoxById, isLoadingCashBoxStore, errorCashBoxStore } = useCashBoxStore()

    const onSubmit = async (e, onClose) => {
        e.preventDefault()
        await unlinkMainBoxById(box.id)
        await fetchMainBox()
        onClose()
    }

    if (!box) return(<></>)

    return (
        <>
            <Tooltip content="Desvincular" color="danger">
                <Button isIconOnly variant="light" onPress={onOpen}>
                    <Unlink size={20} strokeWidth={2} color="#F44336" />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent className="border-3 border-red-600">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">¿Esta seguro/a que desea quitar este item?</ModalHeader>
                            <ModalBody>
                                <Form
                                    onSubmit={(e) => onSubmit(e, onClose)}
                                >
                                    <div className="flex justify-center gap-2">
                                        <span className="font-bold">Descripción:</span>
                                        <span className="">{box.description}</span>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <span className="font-bold">Responsable:</span>
                                        <span className="">{capitalizeFirstLetter(box.user.name)}</span>
                                    </div>
                                    <div className="flex justify-center gap-2">
                                        <span className="font-bold">Cerrada el:</span>
                                        <span className="">{formatDateFromDB(box.closed_at)}</span>
                                    </div>
                                    <div className="flex flex-col justify-center mt-4 text-2xl font-mono">
                                        <div className="flex gap-4 justify-between">
                                            <span className="font-bold">ARS</span>
                                            <span>{formatCurrency(box.total_ars)}</span>
                                        </div>
                                        <div className="flex gap-4 justify-between">
                                            <span className="font-bold">USD</span>
                                            <span>{formatCurrency(box.total_usd)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full justify-end ">
                                        <Button color="default" variant="light" onPress={onClose}>Cerrar</Button>
                                        <Button color="danger" type="submit">Eliminar</Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default UnlinkCashBoxForMainBox