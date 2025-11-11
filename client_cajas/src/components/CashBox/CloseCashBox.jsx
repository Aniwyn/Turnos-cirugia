import { useNavigate } from 'react-router-dom';
import {
    Button,
    Divider,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    useDisclosure,
    Form,
} from "@heroui/react"
import { CopyCheck, NotebookPen } from 'lucide-react'
import useCashBoxStore from "../../store/useCashBoxStore"
import useCashMovementStore from "../../store/useCashMovementStore"
import { formatCurrency } from '../../tools/utils'

const CloseCashBox = ({ summary, boxName, setBoxName, boxId, movements }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { closeBox, isLoadingCashBoxStore } = useCashBoxStore()
    const { fetchCashMovements } = useCashMovementStore()
    const navigate = useNavigate()
    const errors = {}

    const onSubmit = async (e, onClose) => {
        e.preventDefault()

        try {
            await closeBox(boxId, boxName.trim())
            onClose?.()
        } catch (e) {
            alert(e.message)
        } finally {
            await fetchCashMovements()
            onClose()
        }
        navigate('/')
    }

    return (
        <>
            <Button
                className='bg-gradient-to-tr from-green-200 to-lime-200'
                color="success"
                variant="flat"
                startContent={<CopyCheck height={20} />}
                onPress={onOpen}
                isDisabled={!Array.isArray(movements) || !movements.length > 0}
            >
                <span className="w-full">Cerrar caja</span>
            </Button>
            <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
                <ModalContent className="border-3 border-green-600">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">¿Esta seguro/a que desea cerrar la caja?</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full justify-center items-center space-y-4"
                                    validationErrors={errors}
                                    onSubmit={(e) => onSubmit(e, onClose)}
                                >
                                    <Input
                                        isRequired
                                        startContent={<NotebookPen size={20} color="#a1a1ab" strokeWidth={2} />}
                                        label="Nombre de la caja"
                                        value={boxName}
                                        onValueChange={setBoxName}
                                        isClearable
                                    />
                                    <Divider className="my-3" />
                                    <div className="flex justify-between px-5 items-center">
                                        <span className="text-4xl pr-4">Total ARS</span>
                                        <span className="text-4xl font-thin" style={{ color: summary?.ARS < 0 ? "#c10007" : "#008236" }}>{summary?.ARS ? formatCurrency(summary.ARS) : "0"}</span>
                                    </div>
                                    <div className="flex justify-between px-5 items-center">
                                        <span className="text-4xl pr-4">Total USD</span>
                                        <span className="text-4xl font-thin" style={{ color: summary?.USD < 0 ? "#c10007" : "#008236" }}>{summary?.USD ? formatCurrency(summary.USD) : "0"}</span>
                                    </div>
                                    <div className="flex w-full gap-2 justify-end items-end my-4">
                                        <Button color="default" variant="light" onPress={onClose}>Cerrar</Button>
                                        <Button color="primary" type='submit' disabled={isLoadingCashBoxStore}>Cerrar caja</Button>
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

export default CloseCashBox