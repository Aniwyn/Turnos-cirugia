import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
} from "@heroui/react";
import { EllipsisVertical } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import LoadingPage from '../../pages/LoadingPage'
import useAccountingLedgerStore from '../../store/useAccountingLedgerStore'
import { formatCurrency, formatDateFromDB } from '../../tools/utils'

export const columns = [
    { name: "ID", uid: "main_box_id", sortable: true, size: 50, align: "center" },
    { name: "Fecha", uid: "transaction_date", sortable: true, size: 100, align: "center" },
    { name: "Monto ARS", uid: "amount_ars", sortable: true, size: 100, align: "end" },
    { name: "Monto USD", uid: "amount_usd", sortable: true, size: 100, align: "end" },
    { name: "Saldo ARS", uid: "balance_ars_after", sortable: true, size: 100, align: "end" },
    { name: "Saldo USD", uid: "balance_usd_after", sortable: true, size: 100, align: "end" }
]

const LedgerTable = () => {
    const [queryTerms, setQueryTerms] = useState({})
    const [sortDescriptor, setSortDescriptor] = useState({})
    const navigate = useNavigate()
    const { ledgers, fetchPaginatedLedger, pagination, isLoadingLedgerStore } = useAccountingLedgerStore()

    const hasSearchFilter = Boolean(queryTerms)

    useEffect(() => {
        fetchPaginatedLedger()
    }, [])

    const sortedItems = useMemo(() => {
        return [...ledgers].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, ledgers])

    const renderCell = useCallback((patient, columnKey) => {
        const cellValue = patient[columnKey]

        switch (columnKey) {
            case "transaction_date":
                return(formatDateFromDB(cellValue))
            case "amount_ars":
                return(<span className={`py-2 px-4 text-right ${cellValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{`$ ${formatCurrency(cellValue)}`}</span>)
            case "amount_usd":
                return(<span className={`py-2 px-4 text-right ${cellValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{`US$ ${formatCurrency(cellValue)}`}</span>)
            case "balance_ars_after":
                return(<span className={`py-2 px-4 text-right`}>{`$ ${formatCurrency(cellValue)}`}</span>)
            case "balance_usd_after":
                return(<span className={`py-2 px-4 text-right`}>{`US$ ${formatCurrency(cellValue)}`}</span>)
            default:
                return cellValue
        }
    }, [])

    const handlePage = (page) => {
        fetchPaginatedLedger(page)
    }

    const bottomContent = useMemo(() => {
        if (!pagination || !pagination.totalPages || pagination.totalPages == 0) return
        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    page={pagination.currentPage}
                    total={pagination.totalPages}
                    onChange={handlePage}
                    color="primary"
                    isCompact
                    showControls
                    showShadow
                />
            </div>
        )
    }, [pagination, hasSearchFilter])

    if (isLoadingLedgerStore) return (<LoadingPage />)

    return (
        <Table
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            className="max-w-[1250px] mx-auto"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            isHeaderSticky
            isStriped
            removeWrapper
            isCompact
            aria-label="Tabla de pacientes"
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.align}
                        allowsSorting={column.sortable}
                        width={column.size}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={"No se encontraron pacientes."}
                items={sortedItems}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default LedgerTable