import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Chip,
    DatePicker,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Spinner
} from "@heroui/react"
import { today } from "@internationalized/date"
import useCashBoxStore from '../store/useCashBoxStore'
import EditOpenCashBox from '../components/MyCashClosures/EditOpenCashBox'
import { capitalizeFirstLetter } from '../Helper'

const originColorMap = {
    admin: "warning",
    manual: "primary",
    medical: "secondary",
    own: "success"
}

const originTextMap = {
    admin: "Administración",
    manual: "Manual",
    medical: "Medicos",
    own: "Propia"
}

const stateTextMap = {
    closed: "Cerrada",
    open: "Abierta",
    cancelled: "Cancelada"
}

const stateColorMap = {
    closed: "primary",
    open: "success",
    cancelled: "danger"
}

const CashBox = () => {
    const [page, setPage] = useState(1)
    const [date, setDate] = useState()
    const [sortDescriptor, setSortDescriptor] = useState({ column: "none", direction: "ascending" })
    const rowsPerPage = Math.trunc((window.innerHeight - 200) / 36)
    const { boxes, fetchBoxes, isLoading } = useCashBoxStore()

    useEffect(() => {
        fetchBoxes()
    }, [])

    const filteredItems = useMemo(() => {
        if (!date) return boxes

        let filtered = [...boxes]
        const selectedDateStr = date.toDate?.().toISOString().slice(0, 10)

        filtered = filtered.filter(item => item.closed_at?.slice(0, 10) === selectedDateStr)

        return filtered
    }, [boxes, date])

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

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey]

        switch (columnKey) {
            case "closed_at":
                if (!cellValue) return "-"
                return `${cellValue.slice(8, 10)}/${cellValue.slice(5, 7)}/${cellValue.slice(0, 4)}`
            case "description":
                if (!cellValue) return "-"
                return cellValue
            case "user":
                return capitalizeFirstLetter(cellValue.name)
            case "origin":
                return <Chip color={originColorMap[cellValue]} size="sm" variant="flat">{originTextMap[cellValue]}</Chip>
            case "state":
                return (<Chip color={stateColorMap[cellValue]} size="sm" variant="flat">{stateTextMap[cellValue]}</Chip>)
            case "total_ars":
                if (item.state == "open") return <span className="flex justify-end">-</span>
                return (
                    <div className="flex justify-end">
                        <span className="pr-4">$</span>
                        <span className="font-semibold" style={{ color: cellValue < 0 ? "#82181a" : "#0d542b" }}>{cellValue ? formatter(cellValue) : "0"}</span>
                    </div>
                )
            case "total_usd":
                if (item.state == "open") return <span className="flex justify-end">-</span>
                return (
                    <div className="flex justify-end">
                        <span className="pr-4">USD</span>
                        <span className="font-semibold" style={{ color: cellValue < 0 ? "#82181a" : "#0d542b" }}>{cellValue ? formatter(cellValue) : "-"}</span>
                    </div>
                )
            case "actions":
                return (
                    <div className="relative flex items-center justify-end">
                        { item.state == 'open' ? <EditOpenCashBox /> : <></> }
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row gap-4 rounded-[14px]'>
                <div className="flex flex-col min-w-[160px] flex-wrap md:flex-nowrap pt-6">
                    <h2 className='font-bold text-center hover-bg-transparent bg-red pb-4'>Filtrar</h2>
                    <div className='flex items-center gap-1'>
                        <DatePicker className="max-w-[284px]" label="Buscar por fecha" variant="underlined" maxValue={today()} value={date} onChange={setDate} showMonthAndYearPickers />
                        {/*<button className='flex text-red-600 hover:text-white hover:bg-red-300 rounded-[50%] px-2 pb-1 cursor-pointer text-sm' onClick={clearDate}>x</button>*/}
                    </div>
                </div>
                <div className='h-full w-full'>
                    <Table
                        aria-label='Tabla de cierres de cajas'
                        isHeaderSticky
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color="primary"
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                />
                            </div>
                        }
                        className='h-full max-h-full w-full'
                        removeWrapper
                        maxTableHeight={200}
                        color='primary'
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader>
                            <TableColumn key="closed_at" allowsSorting>Fecha cierre</TableColumn>
                            <TableColumn key="description" allowsSorting>Descripcion</TableColumn>
                            <TableColumn key="user" allowsSorting>Responsable</TableColumn>
                            <TableColumn key="origin" allowsSorting>Origen</TableColumn>
                            <TableColumn key="state" allowsSorting>Estado</TableColumn>
                            <TableColumn key="total_ars" allowsSorting>USD</TableColumn>
                            <TableColumn key="total_usd" allowsSorting>ARS</TableColumn>
                            <TableColumn key="actions" allowsSorting>Acciones</TableColumn>
                        </TableHeader>
                        <TableBody
                            isLoading={isLoading}
                            items={items}
                            loadingContent={<Spinner label="Loading..." />}
                            emptyContent={"No se registran cajas para este usuario."}
                        >
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default CashBox