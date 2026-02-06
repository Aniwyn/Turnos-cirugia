import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Input, DatePicker, Chip } from "@heroui/react"
import { Search, BrushCleaning } from 'lucide-react'
import { I18nProvider } from "@react-aria/i18n"
import useBudgetStore from '../store/useBudgetStore'
import LoadingPage from './LoadingPage'
import { formatDateFromDB, formatCurrency } from '../tools/utils'
import BudgetDetail from "../components/Budgets/BudgetDetail"
import BreadcrumbsLayout from "../layouts/BreadcrumbsLayout"

const columns = [
    { name: "ID", uid: "id" },
    { name: "FECHA", uid: "budget_date" },
    { name: "PACIENTE", uid: "patient_name" },
    { name: "DNI", uid: "patient_dni" },
    { name: "TOTAL", uid: "total" },
    { name: "ACCIONES", uid: "actions" },
]

const Budgets = () => {
    const navigate = useNavigate()
    const { budgets, fetchPaginatedBudgets, fetchFilteredBudgets, currentPage, totalPages, isLoadingBudgetStore } = useBudgetStore()

    const [filters, setFilters] = useState({
        patient_name: "",
        patient_last_name: "",
        patient_dni: "",
        budget_date: null
    })

    useEffect(() => {
        fetchPaginatedBudgets()
    }, [])

    const handlePageChange = (page) => {
        fetchPaginatedBudgets(page)
    }

    const handleSearch = () => {
        const query = {}
        if (filters.patient_name) query.patient_name = filters.patient_name
        if (filters.patient_last_name) query.patient_last_name = filters.patient_last_name
        if (filters.patient_dni) query.patient_dni = filters.patient_dni
        if (filters.budget_date) {
            const date = filters.budget_date
            query.budget_date = date ? date.toString() : null
        }

        fetchFilteredBudgets(query)
    }

    const handleClearFilters = () => {
        setFilters({
            patient_name: "",
            patient_last_name: "",
            patient_dni: "",
            budget_date: null
        })
        fetchFilteredBudgets({})
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const renderCell = useCallback((budget, columnKey) => {
        const cellValue = budget[columnKey]

        switch (columnKey) {
            case "budget_date":
                return (
                    <div className="flex flex-col">
                        <span className="text-small font-bold">{formatDateFromDB(cellValue)}</span>
                    </div>
                )
            case "patient_name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                )
            case "total":
                return (
                    <Chip color="success" variant="flat" size="sm">
                        $ {formatCurrency(cellValue)}
                    </Chip>
                )
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <BudgetDetail budget={budget} />
                    </div>
                )
            default:
                return cellValue
        }
    }, [navigate])

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-end gap-3 items-end">
                    <div className="flex flex-wrap md:flex-nowrap gap-3 w-full justify-end">
                        <Input
                            isClearable
                            className="w-full md:max-w-[15%]"
                            placeholder="DNI..."
                            value={filters.patient_dni}
                            onValueChange={(val) => setFilters(prev => ({ ...prev, patient_dni: val }))}
                            onKeyDown={handleKeyDown}
                        />
                        <Input
                            isClearable
                            className="w-full md:max-w-[15%]"
                            placeholder="Apellido..."
                            value={filters.patient_last_name}
                            onValueChange={(val) => setFilters(prev => ({ ...prev, patient_last_name: val }))}
                            onKeyDown={handleKeyDown}
                        />
                        <Input
                            isClearable
                            className="w-full md:max-w-[15%]"
                            placeholder="Nombre..."
                            value={filters.patient_name}
                            onValueChange={(val) => setFilters(prev => ({ ...prev, patient_name: val }))}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="w-full md:max-w-[15%]">
                            <I18nProvider locale="es-AR">
                                <DatePicker
                                    aria-label="Fecha de presupuesto"
                                    value={filters.budget_date}
                                    onChange={(val) => setFilters(prev => ({ ...prev, budget_date: val }))}
                                    showMonthAndYearPickers
                                />
                            </I18nProvider>
                        </div>
                        <div className="flex gap-2">
                            <Button color="primary" isIconOnly onPress={handleSearch}>
                                <Search size={20} />
                            </Button>
                            <Button isIconOnly onPress={handleClearFilters} title="Limpiar filtros">
                                <BrushCleaning size={20} className="text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }, [filters, handleSearch, handleClearFilters, navigate])

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={currentPage}
                    total={totalPages || 1}
                    onChange={handlePageChange}
                />
            </div>
        )
    }, [currentPage, totalPages])

    if (isLoadingBudgetStore && !budgets.length) return <LoadingPage />

    return (
        <div className="px-6 max-w-350 mx-auto">
            <BreadcrumbsLayout addresses={["home", "budgets"]} />
            <Table
                aria-label="Tabla de presupuestos"
                isHeaderSticky
                removeWrapper
                isCompact
                topContent={topContent}
                topContentPlacement="outside"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[600px] bg-white",
                    tbody: "bg-white"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" || column.uid === "total" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"No se encontraron presupuestos"}
                    items={budgets}
                    isLoading={isLoadingBudgetStore}
                    loadingContent={<LoadingPage />}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Budgets