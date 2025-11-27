import { useCallback, useEffect, useState } from "react"
import {
    Button,
    Modal,
    ModalContent,
    ModalBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    useDisclosure,
} from "@heroui/react"
import { Link, Plus } from 'lucide-react'
import useCashBoxStore from '../../store/useCashBoxStore'
import { formatCurrency, formatDateFromDB, capitalizeFirstLetter } from '../../tools/utils'
import LoadingPage from "../../pages/LoadingPage"

const ViewAvailableCashBoxes = ({ linkCashBoxesToMainBox, loadingSubmit }) => {
    const [cashBoxes, setCashBoxes] = useState([])
    const [sortDescriptor, setSortDescriptor] = useState({})
    const [selectedKeys, setSelectedKeys] = useState(new Set())
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { fetchAvailableForMainBox, isLoadingCashBoxStore, errorCashBoxStore } = useCashBoxStore()

    useEffect(() => {
        const init = async () => {
            const fetchedCashBoxes = await fetchAvailableForMainBox()
            setCashBoxes(fetchedCashBoxes)
            setSelectedKeys(new Set())
        }

        if (isOpen) init()
    }, [isOpen])

    const renderCell = useCallback((cashBox, columnKey) => {
        const cellValue = cashBox[columnKey]

        switch (columnKey) {
            case "created_at":
                return (<p className="text-small">{formatDateFromDB(cellValue)}</p>)
            case "user_id":
                return (cashBox.user ? <span>{capitalizeFirstLetter(cashBox.user.name)}</span> : <span>ERROR: Usuario no encontrado</span>)
            case "total_ars":
                return cellValue != 0 ?
                    <div className="flex justify-between">
                        <span className="pr-4">$</span>
                        <span>{cellValue ? formatCurrency(cellValue) : "0"}</span>
                    </div>
                    : <></>
            case "total_usd":
                return cellValue != 0 ?
                    <div className="flex justify-between">
                        <span className="pr-4">USD</span>
                        <span>{cellValue ? formatCurrency(cellValue) : "0"}</span>
                    </div>
                    : <></>
            default:
                return cellValue
        }
    }, [])

    const onSubmit = (onClose) => {
        const selectedKeysToSend = (selectedKeys === 'all' ?
            new Set(cashBoxes.map(box => box.id))
            :
            selectedKeys
        )

        linkCashBoxesToMainBox(selectedKeysToSend)
        onClose()
    }

    if (loadingSubmit) return (<Modal isOpen={true} size="5xl" backdrop="blur" isDismissable />)
    if (isLoadingCashBoxStore) return (<LoadingPage />)

    return (
        <>
            <Button
                onPress={onOpen}
                startContent={<Link size={18} />}
                variant="solid"
                color="success"
                className="bg-gradient-to-tr from-emerald-600 to-lime-500 text-white"
            >
                Vincular caja
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl" backdrop="blur" >
                <ModalContent className="flex">
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <div className="flex flex-col gap-2 p-4">
                                    <Table
                                        aria-label="Tabla con movimientos de caja."
                                        sortDescriptor={sortDescriptor}
                                        onSortChange={setSortDescriptor}
                                        color="success"
                                        classNames={{
                                            wrapper: "max-h-[80vh] p-0 overflow-y-auto shadow-none",
                                        }}
                                        selectionMode="multiple"
                                        isHeaderSticky
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={setSelectedKeys}
                                    >
                                        <TableHeader>
                                            <TableColumn key="id" width={20}>Caja</TableColumn>
                                            <TableColumn key="created_at" width={30} allowsSorting>Fecha de cierre</TableColumn>
                                            <TableColumn key="description" width={300}>Descripción</TableColumn>
                                            <TableColumn key="user_id" width={80} align="center" allowsSorting>Responsable</TableColumn>
                                            <TableColumn key="total_ars" width={150} align="center" allowsSorting>ARS</TableColumn>
                                            <TableColumn key="total_usd" width={150} align="center" allowsSorting>USD</TableColumn>
                                        </TableHeader>
                                        <TableBody emptyContent={"No se encontraron movimientos."} items={cashBoxes}>
                                            {(item) => (
                                                <TableRow key={item.id}>
                                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    <div className="flex gap-4 justify-end">
                                        <Button
                                            onPress={() => onClose()}
                                            variant="light"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            onPress={() => onSubmit(onClose)}
                                            isDisabled={selectedKeys.size <= 0}
                                            startContent={<Plus size={18} />}
                                            className="bg-gradient-to-tr from-emerald-600 to-lime-500 text-white"
                                        >
                                            Añadir seleccionadas
                                        </Button>
                                    </div>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ViewAvailableCashBoxes