import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Card,
    CardBody,
    Checkbox,
    CheckboxGroup,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@heroui/react"
import useCashBoxStore from '../store/useCashBoxStore'
import useCashMovementStore from '../store/useCashMovementStore'
import LoadingPage from "./LoadingPage"
import ErrorPage from "./ErrorPage"
import CreateCashMovement from "../components/CashBox/CreateCashMovement"
import UpdateCashMovement from "../components/CashBox/UpdateCashMovement"
import DeleteCashMovement from "../components/CashBox/DeleteCashMovement"
import CloseCashBox from "../components/CashBox/CloseCashBox"
import { formatCurrency, formatDateFromDB } from  '../tools/utils'

const currencyOptions = [
    { name: "ARS", uid: "ARS" },
    { name: "USD", uid: "USD" }
]

const labelColorMap = {
    income: "success",
    expense: "danger"
}

const currencyColorMap = {
    ARS: "primary",
    USD: "warning"
}

const CashBox = () => {
    const [boxId, setBoxId] = useState()
    const [boxName, setBoxName] = useState("")
    const [currencyFilter, setCurrencyFilter] = useState(["ARS", "USD"])
    const [sortDescriptor, setSortDescriptor] = useState({})
    const [movements, setMovements] = useState([])
    const { fetchMyActiveCashBox, isLoadingCashBoxStore, errorCashBoxStore } = useCashBoxStore()
    const { fetchMyActiveCashMovements, isLoadingCashMovementStore, errorCashMovementStore } = useCashMovementStore()

    useEffect(() => {
        const fetchBox = async () => {
            const box = await fetchMyActiveCashBox()
            if (box) {
                setBoxId(box.id)
                setBoxName(box.description)
                const data = await fetchMyActiveCashMovements(box.id)
                setMovements(data)
            }
        }

        fetchBox()
    }, [])

    const summary = useMemo(() => {
        return movements.reduce(
            (acc, { type, currency, amount }) => {
                const sign = type === "income" ? 1 : -1
                acc[currency] += amount * sign
                return acc
            },
            { ARS: 0, USD: 0 }
        )
    }, [movements])

    const filteredItems = useMemo(() => {
        let filtered = [...movements]

        if (currencyFilter !== "all" && Array.from(currencyFilter).length !== currencyOptions.length) {
            filtered = filtered.filter((movement) =>
                Array.from(currencyFilter).includes(movement.currency)
            )
        }

        return filtered
    }, [movements, currencyFilter])

    const items = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [filteredItems, sortDescriptor])

    const renderCell = useCallback((movement, columnKey) => {
        const cellValue = movement[columnKey]

        switch (columnKey) {
            case "created_at":
                return (<p className="text-small">{formatDateFromDB(cellValue)}</p>)
            case "notes":
                return (<p className="font-semibold text-small">{cellValue}</p>)
            case "label":
                return (<Chip color={labelColorMap[movement.type]} size="sm" variant="flat">{cellValue.name}</Chip>)
            case "amount":
                return (
                    <div className="flex justify-between">
                        <span className="pr-4">$</span>
                        <span>{movement.type == "expense" ? "- " : ""}{cellValue ? formatCurrency(cellValue) : "0"}</span>
                    </div>
                )
            case "currency":
                return (<Chip color={currencyColorMap[cellValue]} size="sm" variant="flat">{cellValue}</Chip>)
            case "actions":
                return (
                    <div className="relative flex items-center justify-end">
                        <UpdateCashMovement movement={movement} setMovements={setMovements}/>
                        <DeleteCashMovement movement={movement} setMovements={setMovements}/>
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    if (isLoadingCashMovementStore || isLoadingCashBoxStore) return(<LoadingPage />)
    if (errorCashBoxStore) return(<ErrorPage errorMessage={errorCashBoxStore} />)
    if (errorCashMovementStore) return(<ErrorPage errorMessage={errorCashMovementStore} />)
    if (!boxId) return (<></>)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end gap-4 bg-white rounded-2xl p-2">
                <Card className="w-full shadow-none">
                    <CardBody className="flex justify-center">
                        <p className="p-2 text-3xl font-thin overflow-hidden text-ellipsis whitespace-nowrap">{boxName}</p>
                    </CardBody>
                </Card>
                <Card className="relative w-full max-w-70 bg-gradient-to-r from-cyan-300 to-blue-500 text-white overflow-hidden shadow-lg">
                    <CardBody className="bg-[url('/src/assets/circle.svg')] bg-right bg-no-repeat py-4 ps-10">
                        <p className="font-bold">Total ARS</p>
                        <p className="text-2xl">$ {formatCurrency(summary.ARS)}</p>
                    </CardBody>
                </Card>
                <Card className="relative w-full max-w-70 bg-gradient-to-r from-lime-400 to-green-500 text-white overflow-hidden shadow-lg">
                    <CardBody className="bg-[url('/src/assets/circle.svg')] bg-right bg-no-repeat py-4 ps-10">
                        <p className="font-bold">Total USD</p>
                        <p className="text-2xl">USD {formatCurrency(summary.USD)}</p>
                    </CardBody>
                </Card>
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col justify-between min-w-48 h-80 bg-white rounded-2xl p-2">
                    <div className="flex flex-col gap-5">
                        <CreateCashMovement boxId={boxId} setMovements={setMovements} />
                        <CheckboxGroup value={currencyFilter} onValueChange={setCurrencyFilter} label="Moneda">
                            {currencyOptions.map(currency => <Checkbox key={currency.uid} className="ms-2" value={currency.uid}>{currency.name}</Checkbox>)}
                        </CheckboxGroup>
                    </div>
                    {movements && <CloseCashBox summary={summary} boxName={boxName} setBoxName={setBoxName} boxId={boxId} movements={movements} />}
                </div>
                <Table
                    aria-label="Tabla con movimientos de caja."
                    isHeaderSticky
                    classNames={{
                        wrapper: "max-h-[382px]",
                    }}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    removeWrapper
                    className="bg-white rounded-2xl p-2"
                >
                    <TableHeader>
                        <TableColumn key="created_at" width={110} allowsSorting>Fecha</TableColumn>
                        <TableColumn key="notes" allowsSorting>Descripción</TableColumn>
                        <TableColumn key="label" width={110}  align="center">Concepto</TableColumn>
                        <TableColumn key="amount" width={150} align="center" allowsSorting>Monto</TableColumn>
                        <TableColumn key="currency" width={50} align="center" allowsSorting>Moneda</TableColumn>
                        <TableColumn key="actions" width={120} align="center">Acciones</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No se encontraron movimientos."} items={items}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default CashBox