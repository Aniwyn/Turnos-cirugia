
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
import LoadingPage from "../../pages/LoadingPage"
import useMainBoxStore from "../../store/useMainBoxStore"
import { capitalizeFirstLetter, formatCurrency, formatDateFromDB, formatTimeFromDB } from "../../tools/utils"

const ViewMainBoxDetail = ({ boxId }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { fetchMainBoxById, isLoadingMainBoxStore, errorMainBoxStore } = useMainBoxStore()
    const [box, setBox] = useState()

    useEffect(() => {
        const init = async () => {
            const fetchedBox = await fetchMainBoxById(boxId)
            setBox(fetchedBox)
        }

        if (isOpen && boxId) init()
    }, [isOpen])

    if (isLoadingMainBoxStore) return (<LoadingPage />)

    return (
        <>
            <Tooltip content="Ver detalles">
                <Button isIconOnly variant="light" onPress={onOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <Eye strokeWidth={1.2} color="#2196F3" />
                </Button>
            </Tooltip>
            <Modal isOpen={isOpen} size="5xl" placement="top-center" onOpenChange={onOpenChange} backdrop="blur" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Detalles de la caja general</ModalHeader>
                            <ModalBody>
                                {box &&
                                    <div className="flex flex-col">
                                        <div className="flex gap-2">
                                            <span className="font-bold" >ID:</span>
                                            <span>{box.id}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold" >Descripción:</span>
                                            <span>{box.description}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold" >Responsable:</span>
                                            <span>{`(${box.user_id}) ${capitalizeFirstLetter(box.user.name)}`}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="font-bold" >Cerrada el:</span>
                                            <span>{`${formatDateFromDB(box.closed_at)} a las ${formatTimeFromDB(box.closed_at)}`}</span>
                                        </div>
                                        {box.main_box_id &&
                                            <div className="flex gap-2">
                                                <span className="font-bold" >Añadida a la caja general N°:</span>
                                                <span>{box.main_box_id}</span>
                                            </div>
                                        }
                                        {Array.isArray(box.cashBox) && box.cashBox.length > 0 && (
                                            <div className="grid grid-cols-11 px-8 py-4">
                                                <div className="col-span-1 font-bold flex justify-center">
                                                    ID
                                                </div>
                                                <div className="col-span-2 font-bold flex justify-center">
                                                    Fecha cierre
                                                </div>
                                                <div className="col-span-4 font-bold">
                                                    Descripción
                                                </div>
                                                <div className="col-span-2 font-bold flex justify-center">
                                                    ARS
                                                </div>
                                                <div className="col-span-2 font-bold flex justify-center">
                                                    USD
                                                </div>
                                                {box.cashBox.map((box) => (
                                                    <>
                                                        <div className="col-span-1 flex justify-center">
                                                            {box.id}
                                                        </div>
                                                        <div className="col-span-2 flex justify-center">
                                                            {`${formatDateFromDB(box.created_at)}`}
                                                        </div>
                                                        <div className="col-span-4">
                                                            {box.description}
                                                        </div>
                                                        <div className="col-span-2 flex justify-end">
                                                            {`$ ${formatCurrency(box.total_usd)}`}
                                                        </div>
                                                        <div className="col-span-2 flex justify-end">
                                                            {`$ ${formatCurrency(box.total_ars)}`}
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>Listo</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>
    )
}

export default ViewMainBoxDetail