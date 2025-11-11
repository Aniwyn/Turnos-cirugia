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
import EditOpenMainBox from '../components/MainBoxes/EditOpenMainBox'
import ViewMainBoxDetail from '../components/MainBoxes/ViewMainBoxDetail'
import SearchPanel from '../components/MainBoxes/SearchPanel'
import useMainBoxStore from '../store/useMainBoxStore'
import { capitalizeFirstLetter, formatCurrency, formatDateFromDB, formatTimeFromDB } from '../tools/utils'

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

const MainBoxes = () => {
    const [sortDescriptor, setSortDescriptor] = useState({ column: "id", direction: "descending" })
    const { mainBoxes, fetchMainBoxesPaginated, isLoadingMainBoxStore, queryTerms, currentPage, totalPages, errorMainBoxStore } = useMainBoxStore()

    const hasSearchFilter = Boolean(queryTerms)

    useEffect(() => {
        fetchMainBoxesPaginated()
    }, [])

    const sortedItems = useMemo(() => {
        return [...mainBoxes].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, mainBoxes])

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item[columnKey]

        switch (columnKey) {
            case "closed_at":
                if (!cellValue) return "-"
                return `${formatDateFromDB(cellValue)} - ${formatTimeFromDB(cellValue)}`
            case "user":
                return capitalizeFirstLetter(cellValue.name)
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
                        { item.state == 'open' && <EditOpenMainBox /> }
                        { item.state == 'closed' && <ViewMainBoxDetail boxId={item.id} /> }
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    const handlePage = (page) => {
        fetchMainBoxesPaginated(page)
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
                <SearchPanel />
                <div className='h-full w-full'>
                    <Table
                        isHeaderSticky
                        isCompact
                        bottomContent={bottomContent}
                        className='h-full max-h-full w-full'
                        removeWrapper
                        maxTableHeight={200}
                        color='primary'
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        aria-label='Tabla de cierres de cajas'
                    >
                        <TableHeader>
                            <TableColumn key="id" width={30} align="center" allowsSorting>Caja general</TableColumn>
                            <TableColumn key="closed_at" allowsSorting>Cerrada</TableColumn>
                            <TableColumn key="user" allowsSorting>Responsable</TableColumn>
                            <TableColumn key="state" allowsSorting>Estado</TableColumn>
                            <TableColumn key="total_ars" allowsSorting>USD</TableColumn>
                            <TableColumn key="total_usd" allowsSorting>ARS</TableColumn>
                            <TableColumn key="actions" allowsSorting>Acciones</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={sortedItems}
                            isLoading={isLoadingMainBoxStore}
                            loadingContent={<Spinner label="Loading..." />}
                            emptyContent={"No se encontraron cajas"}
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

export default MainBoxes