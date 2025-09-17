import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Button,
    Card,
    CardBody,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Pagination,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@heroui/react"
import { ChevronDown } from 'lucide-react'
import useCashMovementStore from '../store/useCashMovementStore'
import CreateCashMovement from "../components/CashBox/CreateCashMovement"
import UpdateCashMovement from "../components/CashBox/UpdateCashMovement"
import DeleteCashMovement from "../components/CashBox/DeleteCashMovement"
import CloseCashBox from "../components/CashBox/CloseCashBox"

export const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "NAME", uid: "name", sortable: true },
    { name: "AGE", uid: "age", sortable: true },
    { name: "ROLE", uid: "role", sortable: true },
    { name: "TEAM", uid: "team" },
    { name: "EMAIL", uid: "email" },
    { name: "STATUS", uid: "status", sortable: true },
    { name: "ACTIONS", uid: "actions" },
]

export const currencyOptions = [
    { name: "USD", uid: "USD" },
    { name: "ARS", uid: "ARS" },
]

const labelColorMap = {
    income: "success",
    expense: "danger"
}

const currencyColorMap = {
    ARS: "primary",
    USD: "warning"
}

const DailySummary = () => {
    const [currencyFilter, setCurrencyFilter] = useState("all")
    const [sortDescriptor, setSortDescriptor] = useState({ column: "age", direction: "ascending" })
    const [page, setPage] = useState(1)
    const [boxName, setBoxName] = useState("CECI PRUEBAS")
    const { movements, fetchCashMovements, isLoading } = useCashMovementStore()

    useEffect(() => {
        fetchCashMovements()
    }, [])

    const rowsPerPage = Math.trunc((window.innerHeight - 300) / 56)

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

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [filteredItems, sortDescriptor])

    const pages = useMemo(() => {
        return Math.ceil(sortedItems.length / rowsPerPage) || 1
    }, [sortedItems])

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return sortedItems.slice(start, end)
    }, [page, sortedItems])


    const formatter = (number) => {
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    const renderCell = useCallback((movement, columnKey) => {
        const cellValue = movement[columnKey]

        switch (columnKey) {
            case "notes":
                return (<p className="text-bold text-small">{cellValue}</p>)
            case "label":
                return (<Chip color={labelColorMap[movement.type]} size="sm" variant="flat">{cellValue.name}</Chip>)
            case "amount":
                return (
                    <div className="flex justify-end">
                        <span className="pr-4">$</span>
                        <span className="font-semibold" style={{ color: movement.type === "expense" ? "#82181a" : "#0d542b" }}>{movement.type == "expense" ? "-" : ""}{cellValue ? formatter(cellValue) : "0"}</span>
                    </div>
                )
            case "currency":
                return (<Chip color={currencyColorMap[cellValue]} size="sm" variant="flat">{cellValue}</Chip>)
            case "actions":
                return (
                    <div className="relative flex items-center justify-end">
                        <UpdateCashMovement movement={movement} />
                        <DeleteCashMovement movement={movement} />
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    const bottomContent = useMemo(() => {
        if (pages <= 1) return null
        return (
            <div className="py-0 px-2 flex justify-end items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        )
    }, [items.length, page, pages])

    return (
        <div className="flex-col">
            <div className="flex justify-end mx-10 mb-4 gap-8">
                <Card className="bg-gradient-to-r from-stone-100 to-slate-50 w-full ms-48 shadow-none">
                    <CardBody className="flex justify-center">
                        <p className="text-3xl font-thin">{boxName}</p>
                    </CardBody>
                </Card>
                <Card className="relative w-180 bg-gradient-to-r from-cyan-300 to-blue-500 text-white overflow-hidden shadow-lg">
                    <CardBody className="bg-[url('/src/assets/circle.svg')] bg-right bg-no-repeat py-4 ps-10 pe-6">
                        <p className="font-bold">Total ARS</p>
                        <p className="text-2xl">$ {formatter(summary.ARS)}</p>
                    </CardBody>
                </Card>
                <Card className="relative w-180 bg-gradient-to-r from-lime-400 to-green-500 text-white overflow-hidden shadow-lg">
                    <CardBody className="bg-[url('/src/assets/circle.svg')] bg-right bg-no-repeat py-4 ps-10 pe-6">
                        <p className="font-bold">Total USD</p>
                        <p className="text-2xl">USD {formatter(summary.USD)}</p>
                    </CardBody>
                </Card>
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col justify-between min-w-48">
                    <div className="flex flex-col gap-5">
                        <CreateCashMovement />
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDown height={20}/>} variant="flat">Moneda</Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={currencyFilter}
                                selectionMode="multiple"
                                onSelectionChange={setCurrencyFilter}
                            >
                                {currencyOptions.map((status) => (
                                    <DropdownItem key={status.uid}>{status.name}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <CloseCashBox summary={summary} boxName={boxName} setBoxName={setBoxName} boxId={1} />
                </div>
                <Table
                    isHeaderSticky
                    bottomContent={bottomContent}
                    bottomContentPlacement="outside"
                    classNames={{
                        wrapper: "max-h-[382px]",
                    }}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    removeWrapper
                    className="mx-10"
                >
                    <TableHeader>
                        <TableColumn key="notes" allowsSorting>Fecha</TableColumn>
                        <TableColumn key="notes" allowsSorting>Descripción</TableColumn>
                        <TableColumn key="notes" allowsSorting>Responsable</TableColumn>
                        <TableColumn key="label" align="center">Origen</TableColumn>
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

export default DailySummary