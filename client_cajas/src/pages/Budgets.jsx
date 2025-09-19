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
    Input,
    Button,
    Pagination,
} from "@heroui/react";
import { EllipsisVertical, Plus, Search } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import LoadingPage from './LoadingPage'
import usePatientStore from '../store/usePatientStore'

export const columns = [
    { name: "ID", uid: "id", sortable: true, size: 70 },
    { name: "DNI", uid: "dni", sortable: true, size: 100 },
    { name: "APELLIDO", uid: "last_name", sortable: true, size: 150 },
    { name: "NOMBRE", uid: "first_name", sortable: true, size: 150 },
    { name: "OBRA SOCIAL", uid: "health_insurance", sortable: true, size: 100 },
    { name: "TEL 1", uid: "phone1", size: 100 },
    { name: "TEL 2", uid: "phone2", size: 100 },
    { name: "ACCIONES", uid: "actions", size: 100 },
];

export const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];

export function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ""
}

const Budgets = () => {
    const [filterValue, setFilterValue] = useState("")
    const [sortDescriptor, setSortDescriptor] = useState({ column: "age", direction: "ascending" })
    const [page, setPage] = useState(1);
    const navigate = useNavigate()
    const { patients, fetchPatients, isLoadingPatientStore } = usePatientStore()
    const rowsPerPage = 49
    const hasSearchFilter = Boolean(filterValue)

    useEffect(() => {
        fetchPatients()
    }, [])

    const filteredItems = useMemo(() => {
        let filteredPatients = [...patients]

        if (hasSearchFilter) {
            filteredPatients = filteredPatients.filter((patient) =>
                patient.first_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                patient.last_name.toLowerCase().includes(filterValue.toLowerCase()) ||
                patient.dni.toLowerCase().includes(filterValue.toLowerCase())
            )
        }

        return filteredPatients
    }, [patients, filterValue])

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end)
    }, [page, filteredItems, rowsPerPage])

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        });
    }, [sortDescriptor, items])

    const renderCell = useCallback((patient, columnKey) => {
        const cellValue = patient[columnKey]

        switch (columnKey) {
            //case "name":
            //    return (
            //        <User
            //            avatarProps={{ radius: "lg", src: user.avatar }}
            //            description={user.email}
            //            name={cellValue}
            //        >
            //            {user.email}
            //        </User>
            //    );
            //case "role":
            //    return (
            //        <div className="flex flex-col">
            //            <p className="text-bold text-small capitalize">{cellValue}</p>
            //            <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
            //        </div>
            //    );
            //case "status":
            //    return (
            //        <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            //            {cellValue}
            //        </Chip>
            //    );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        {/*
                            
                        <EllipsisVertical className="text-default-300" />
                            */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <EllipsisVertical className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem key="view" isDisabled>Ver Ficha</DropdownItem>
                                <DropdownItem key="edit" onPress={() => navigate(`/pacientes/actualizar/${patient.id}`)}>Editar</DropdownItem>
                                <DropdownItem key="delete" onPress={() => navigate(`/presupuesto/${patient.id}`)}>Confeccionar presupuesto</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                )
            default:
                return cellValue
        }
    }, []);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value)
            setPage(1)
        } else {
            setFilterValue("")
        }
    }, [])

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const handleNewPatient = () => {
        navigate('/pacientes/crear')
    }

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre, apellido o dni..."
                        startContent={<Search />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button color="primary" endContent={<Plus size={20} />} onPress={handleNewPatient}>
                            Nuevo paciente
                        </Button>
                    </div>
                </div>
            </div>
        )
    }, [
        filterValue,
        onSearchChange,
        hasSearchFilter,
    ])

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-center items-center">
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
        );
    }, [items.length, page, pages, hasSearchFilter])

    if (isLoadingPatientStore) return (<LoadingPage />)

    return (
        <Table
            isHeaderSticky
            aria-label="Example table with custom cells, pagination and sorting"
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            className="max-w-[1000px] mx-auto"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSortChange={setSortDescriptor}
            isStriped
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
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default Budgets