import { useEffect, useState } from "react"
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
import { Eye } from 'lucide-react'
import useCashBoxStore from "../../store/useCashBoxStore"
import useMainBoxStore from "../../store/useMainBoxStore"
import LoadingPage from "../../pages/LoadingPage"

const ViewMainBoxDetail = ({ boxId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { getCashBoxById, isLoadingCashBoxStore, errorCashBoxStore } = useCashBoxStore()
    const { fetchMainBoxById, isLoadingMainBoxStore, errorMainBoxStore } = useMainBoxStore()
    const [mainBox, setMainBox] = useState()

    useEffect(() => {
        const init = async () => {
            const fechedMainBox = await fetchMainBoxById(boxId)
            setMainBox(fechedMainBox)
        }

        if (isOpen && boxId) init()
    }, [isOpen])

    useEffect(() => {
        console.log(mainBox)
    }, [mainBox])

    if (isLoadingCashBoxStore) return(<LoadingPage />)

    return (
        <>
            <Tooltip content="Ver detalles">
                <Button isIconOnly variant="light" onPress={onOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <Eye strokeWidth={1.2} color="#2196F3" />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} size="5xl" placement="top-center" onOpenChange={onOpenChange} backdrop="blur" isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">Detalles de la caja</ModalHeader>
                        <ModalBody>
                            {mainBox && 
                                <div className="flex flex-col">
                                    <div className="flex gap-2">
                                        <span className="font-bold" >Caja:</span>
                                        <span>{`(${mainBox.id})`}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold" >Responsable:</span>
                                        <span>{mainBox.user.name}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="font-bold" >Cerrada el:</span>
                                        <span>{mainBox.closed_at}</span>
                                    </div>
                                </div>
                                /*Array.isArray*/ //continuara... (?)
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="default" variant="light" onPress={onClose}>Listo</Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ViewMainBoxDetail