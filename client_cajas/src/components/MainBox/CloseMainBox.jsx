import { useNavigate } from 'react-router-dom';
import {
    Button,
    Divider,
    Modal,
    ModalContent,
    ModalBody,
    useDisclosure,
    Form,
} from "@heroui/react"
import { LockKeyhole } from 'lucide-react'
import useMainBoxStore from "../../store/useMainBoxStore"
import { formatCurrency } from '../../tools/utils'


const CloseMainBox = ({ summary, mainBoxId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { closeMainBox, isLoadingMainBoxStore } = useMainBoxStore()
    const navigate = useNavigate()
    const errors = {}

    const onSubmit = async (e, onClose) => {
        e.preventDefault()

        await closeMainBox(mainBoxId)
        onClose()

        navigate('/')
    }

    return (
        <>
            <Button
                className='bg-gradient-to-tr from-rose-600 to-pink-500 text-white'
                color="success"
                variant="flat"
                startContent={<LockKeyhole size={18} />}
                onPress={onOpen}
                isDisabled={summary?.ARS <= 0 && summary?.USD <= 0}
            >
                Cerrar caja general
            </Button>
            <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
                <ModalContent className="bg-gradient-to-tl from-green-100 to-yellow-100">
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <h3 className="flex flex-col gap-1 items-center font-medium text-xl p-3">¿Esta seguro/a que desea cerrar la caja?</h3>
                                <Divider />
                                <Form
                                    className="w-full justify-center items-center space-y-4"
                                    validationErrors={errors}
                                    onSubmit={(e) => onSubmit(e, onClose)}
                                >
                                    <div className='flex flex-col items-between'>
                                        <div className="flex justify-between px-5 items-center">
                                            <span className="text-4xl pr-4">Total ARS</span>
                                            <span className="text-4xl font-thin" style={{ color: summary?.ARS < 0 ? "#c10007" : "#008236" }}>{summary?.ARS ? formatCurrency(summary.ARS) : "0"}</span>
                                        </div>
                                        <div className="flex justify-between px-5 items-center">
                                            <span className="text-4xl pr-4">Total USD</span>
                                            <span className="text-4xl font-thin" style={{ color: summary?.USD < 0 ? "#c10007" : "#008236" }}>{summary?.USD ? formatCurrency(summary.USD) : "0"}</span>
                                        </div>
                                    </div>
                                    <div className="flex w-full gap-2 justify-end items-end my-4">
                                        <Button color="default" variant="light" onPress={onClose} >Cancelar</Button>
                                        <Button color="primary" type='submit' disabled={isLoadingMainBoxStore} className='bg-gradient-to-tr from-emerald-600 to-lime-500 text-white'>Cerrar caja</Button>
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

export default CloseMainBox