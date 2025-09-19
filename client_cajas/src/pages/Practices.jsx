import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
} from "@heroui/react"
import { DollarSign, Save, Search } from 'lucide-react'
import LoadingPage from './LoadingPage'
import usePracticeStore from '../store/usePracticeStore'
import CreatePractice from "../components/Practices/CreatePractice"

export const columns = [
    { name: "MODULO", uid: "module", sortable: true, size: 50 },
    { name: "CODIGO", uid: "code", sortable: true, size: 80 },
    { name: "NOMBRE", uid: "name", sortable: true, size: 400 },
    { name: "VALOR", uid: "default_price", sortable: true, size: 125 },
]

const Practices = () => {
    const [filterValue, setFilterValue] = useState("")
    const [sortDescriptor, setSortDescriptor] = useState({ column: "id", direction: "descending" })
    const { practices, fetchPractices, updatePracticeLocal, saveAllPractices, isLoadingPracticeStore } = usePracticeStore()
    const hasSearchFilter = Boolean(filterValue)

    useEffect(() => {
        fetchPractices()
    }, [])

    const items = useMemo(() => {
        let filtered
        if (hasSearchFilter) {
            filtered = practices.filter((practice) =>
                practice.name.toLowerCase().includes(filterValue.toLowerCase()) ||
                practice.module.toLowerCase().includes(filterValue.toLowerCase()) ||
                practice.code.toLowerCase().includes(filterValue.toLowerCase())
            )
        } else {
            filtered = [...practices]
        }
        return filtered
    }, [practices, filterValue])

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0
            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, items])

    const renderCell = useCallback((practice, columnKey) => {
        const cellValue = practice[columnKey]

        switch (columnKey) {
            case "module":
                return (
                    <Input
                        className="w-full"
                        classNames={{ input: "text-center" }}
                        value={cellValue}
                        onValueChange={(val) => updatePracticeLocal(practice.id, "module", val)}
                    />
                )
            case "code":
                return (
                    <Input
                        className="w-full"
                        classNames={{ input: "text-center" }}
                        value={cellValue}
                        onValueChange={(val) => updatePracticeLocal(practice.id, "code", val)}
                    />
                )
            case "name":
                return (
                    <Input
                        className="w-full"
                        value={cellValue}
                        onValueChange={(val) => updatePracticeLocal(practice.id, "name", val)}
                    />
                )
            case "default_price":
                return (
                    <Input
                        className="w-full"
                        startContent={<DollarSign strokeWidth={0.75} size={16} />}
                        classNames={{ input: "text-right" }}
                        value={cellValue}
                        onValueChange={(val) => {
                            const parsed = val.replace(",", ".")
                            updatePracticeLocal(practice.id, "default_price", parsed)
                        }}
                    />
                )
            default:
                return cellValue
        }
    }, [updatePracticeLocal])

    const onSearchChange = useCallback((value) => {
        if (value) setFilterValue(value)
        else setFilterValue("")
    }, [])

    const onClear = useCallback(() => {
        setFilterValue("")
    }, [])

    if (isLoadingPracticeStore) return (<LoadingPage />)

    return (
        <div className="max-w-[1000px] mx-auto flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end mb-3">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Buscar por módulo, código o nombre..."
                    startContent={<Search />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
                <div className="flex gap-3">
                    <Button color="success" variant="bordered" endContent={<Save size={20} />} onPress={saveAllPractices}>
                        Guardar cambios
                    </Button>
                    <CreatePractice/>
                </div>
            </div>
            <Table
                isHeaderSticky
                aria-label="Tabla de prácticas"
                classNames={{ wrapper: "max-h-[500px]" }}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                removeWrapper
                isCompact
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                            width={column.size}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No se encontraron prácticas"} items={sortedItems}>
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

export default Practices