import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Accordion,
    AccordionItem,
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
import SearchBar from "../components/Patients/SearchBar";

export const columns = [
    { name: "ID", uid: "id", sortable: true, size: 70 },
    { name: "DNI", uid: "dni", sortable: true, size: 80 },
    { name: "APELLIDO", uid: "last_name", sortable: true, size: 150 },
    { name: "NOMBRE", uid: "first_name", sortable: true, size: 150 },
    { name: "OBRA SOCIAL", uid: "HealthInsurance", sortable: true, size: 200 },
    { name: "TEL 1", uid: "phone1", size: 100 },
    { name: "TEL 2", uid: "phone2", size: 100 },
    // { name: "LOCALIDAD", uid: "localidad", size: 200 },
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

const Patients = () => {
    const [queryTerms, setQueryTerms] = useState({})
    const [sortDescriptor, setSortDescriptor] = useState({})
    const navigate = useNavigate()
    const { patients, fetchPatientsPaginated, fetchPatientsFiltered, currentPage, totalPages, isLoadingPatientStore } = usePatientStore()

    const hasSearchFilter = Boolean(queryTerms)

    useEffect(() => {
        fetchPatientsPaginated()
    }, [])

    const handleFilters = (name, value) => {
        setQueryTerms(prev => {
            const updated = { ...prev }

            if (value === "") { delete updated[name] }
            else { updated[name] = value }

            return updated
        })
    }

    const sortedItems = useMemo(() => {
        return [...patients].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [sortDescriptor, patients])

    const renderCell = useCallback((patient, columnKey) => {
        const cellValue = patient[columnKey]

        switch (columnKey) {
            case "HealthInsurance":
                return(cellValue?.name || patient.health_insurance ||"")
            case "localidad":
                return ("-")
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
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
    }, [])

    const handlePage = (page) => {
        fetchPatientsPaginated(page)
    }

    const handleNewPatient = () => {
        navigate('/pacientes/crear')
    }

    const handleSearch = () => {
        fetchPatientsFiltered(queryTerms)
    }

    const topContent = useMemo(() => {
        return (
            <div className="flex gap-10 justify-between items-end mb-2">
                <Button color="primary" startContent={<Plus size={18} />} onPress={handleNewPatient}>
                    Nuevo paciente
                </Button>
                <SearchBar queryTerms={queryTerms} handleFilters={handleFilters} handleSearch={handleSearch}/>
            </div>
        )
    }, [queryTerms, hasSearchFilter])

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

    if (isLoadingPatientStore) return (<LoadingPage />)

    return (
        <Table
            topContent={topContent}
            topContentPlacement="outside"
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
                        align={column.uid === "actions" ? "center" : "start"}
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

export default Patients