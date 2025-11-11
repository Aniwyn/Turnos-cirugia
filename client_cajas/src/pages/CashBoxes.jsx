import { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Chip,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Spinner
} from "@heroui/react"
import useCashBoxStore from '../store/useCashBoxStore'
import EditOpenCashBox from '../components/CashBoxes/EditOpenCashBox'
import ViewCashBoxDetail from '../components/CashBoxes/ViewCashBoxDetail'
import { capitalizeFirstLetter, formatCurrency } from '../tools/utils'
import SearchPanel from '../components/CashBoxes/SearchPanel';

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
    const [sortDescriptor, setSortDescriptor] = useState({ column: "none", direction: "ascending" })
    const { boxes, fetchCashBoxesPaginated, queryTerms, currentPage, totalPages, isLoadingCashBoxStore } = useCashBoxStore()

    const hasSearchFilter = Boolean(queryTerms)

    useEffect(() => {
        fetchCashBoxesPaginated()
    }, [])

    const sortedItems = useMemo(() => {
        return [...boxes].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, boxes])

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey]
        
        switch (columnKey) {
            case "closed_at":
                if (!cellValue) return "-"
                return `${cellValue.slice(8, 10)}/${cellValue.slice(5, 7)}/${cellValue.slice(0, 4)}`
            case "description":
                if (!cellValue) return "-"
                return cellValue
            case "state":
                return (<Chip color={stateColorMap[cellValue]} size="sm" variant="flat">{stateTextMap[cellValue]}</Chip>)
            case "total_ars":
                if (item.state == "open") return <span className="flex justify-end">-</span>
                return (
                    <div className="flex justify-end">
                        <span className="pr-4">$</span>
                        <span className="font-semibold" style={{ color: cellValue < 0 ? "#82181a" : "#0d542b" }}>{cellValue ? formatCurrency(cellValue) : "0"}</span>
                    </div>
                )
            case "total_usd":
                if (item.state == "open") return <span className="flex justify-end">-</span>
                return (
                    <div className="flex justify-end">
                        <span className="pr-4">USD</span>
                        <span className="font-semibold" style={{ color: cellValue < 0 ? "#82181a" : "#0d542b" }}>{cellValue ? formatCurrency(cellValue) : "-"}</span>
                    </div>
                )
            case "actions":
                return (
                    <div className="relative flex items-center justify-end">
                        { item.state == 'open' && <EditOpenCashBox /> }
                        { item.state == 'closed' && <ViewCashBoxDetail boxId={item.id} /> }
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    const handlePage = (page) => {
        fetchCashBoxesPaginated(page)
    }

    const bottomContent = useMemo(() => {
        if (!totalPages || totalPages == 0) return
        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    page={currentPage}
                    total={totalPages}
                    onChange={handlePage}
                    color="primary"
                    isCompact
                    showControls
                    showShadow
                />
            </div>
        )
    }, [currentPage, totalPages, hasSearchFilter])

    return (
        <div className='flex flex-col'>
            <div className='flex flex-row gap-4 rounded-[14px]'>
                <div className="flex flex-col w-full max-w-60 flex-wrap md:flex-nowrap pt-2">
                    <SearchPanel />
                </div>
                <div className='h-full w-full'>
                    <Table
                        aria-label='Tabla de cierres de cajas'
                        isHeaderSticky
                        isCompact
                        bottomContent={bottomContent}
                        className='h-full max-h-full w-full'
                        removeWrapper
                        maxTableHeight={200}
                        color='primary'
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader>
                            <TableColumn key="id" allowsSorting>ID</TableColumn>
                            <TableColumn key="closed_at" allowsSorting>Fecha cierre</TableColumn>
                            <TableColumn key="description" allowsSorting>Descripcion</TableColumn>
                            <TableColumn key="state" allowsSorting>Estado</TableColumn>
                            <TableColumn key="total_ars" allowsSorting>ARS</TableColumn>
                            <TableColumn key="total_usd" allowsSorting>USD</TableColumn>
                            <TableColumn key="actions" allowsSorting>Acciones</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={sortedItems}
                            isLoading={isLoadingCashBoxStore}
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