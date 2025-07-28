import { useMemo, useState } from 'react'
import { 
    DatePicker,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Spinner,
    getKeyValue
} from "@heroui/react"
import { useAsyncList } from "@react-stately/data"
import { today } from "@internationalized/date"

const CashBox = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [date, setDate] = useState()
    const rowsPerPage = Math.trunc((window.innerHeight - 200) / 36)

    let list = useAsyncList({
        //DATOS DE PRUEBA - BORRAR
        async load({ signal }) {
            let items = [
                {
                    key: "1",
                    name: "Tony Reichert",
                    role: "CEO",
                    status: "Active",
                    date: "2025-06-01"
                },
                {
                    key: "2",
                    name: "Zoey Lang",
                    role: "Technical Lead",
                    status: "Paused",
                    date: "2025-06-05"
                },
                {
                    key: "3",
                    name: "Jane Fisher",
                    role: "Senior Developer",
                    status: "Active",
                    date: "2025-06-03"
                },
                {
                    key: "4",
                    name: "William Howard",
                    role: "Community Manager",
                    status: "Vacation",
                    date: "2025-07-02"
                },
                {
                    key: "5",
                    name: "Emily Collins",
                    role: "Marketing Manager",
                    status: "Active",
                    date: "2025-07-01"
                },
                {
                    key: "6",
                    name: "Brian Kim",
                    role: "Product Manager",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "7",
                    name: "Laura Thompson",
                    role: "UX Designer",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "8",
                    name: "Michael Stevens",
                    role: "Data Analyst",
                    status: "Paused",
                    date: "2025-07-03"
                },
                {
                    key: "9",
                    name: "Sophia Nguyen",
                    role: "Quality Assurance",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "10",
                    name: "James Wilson",
                    role: "Front-end Developer",
                    status: "Vacation",
                    date: "2025-07-03"
                },
                {
                    key: "11",
                    name: "Ava Johnson",
                    role: "Back-end Developer",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "12",
                    name: "Isabella Smith",
                    role: "Graphic Designer",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "13",
                    name: "Oliver Brown",
                    role: "Content Writer",
                    status: "Paused",
                    date: "2025-07-03"
                },
                {
                    key: "14",
                    name: "Lucas Jones",
                    role: "Project Manager",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "15",
                    name: "Grace Davis",
                    role: "HR Manager",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "16",
                    name: "Elijah Garcia",
                    role: "Network Administrator",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "17",
                    name: "Emma Martinez",
                    role: "Accountant",
                    status: "Vacation",
                    date: "2025-07-03"
                },
                {
                    key: "18",
                    name: "Benjamin Lee",
                    role: "Operations Manager",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "19",
                    name: "Mia Hernandez",
                    role: "Sales Manager",
                    status: "Paused",
                    date: "2025-07-03"
                },
                {
                    key: "20",
                    name: "Daniel Lewis",
                    role: "DevOps Engineer",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "21",
                    name: "Amelia Clark",
                    role: "Social Media Specialist",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "22",
                    name: "Jackson Walker",
                    role: "Customer Support",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "23",
                    name: "Henry Hall",
                    role: "Security Analyst",
                    status: "Active",
                    date: "2025-07-03"
                },
                {
                    key: "24",
                    name: "Charlotte Young",
                    role: "PR Specialist",
                    status: "Paused",
                    date: "2025-07-03"
                },
                {
                    key: "25",
                    name: "Liam King",
                    role: "Mobile App Developer",
                    status: "Active",
                    date: "2025-07-03"
                },
            ]
            setIsLoading(false)
            return { items }
        },

        async sort({ items, sortDescriptor }) {
            return {
                items: items.sort((a, b) => {
                    let first = a[sortDescriptor.column]
                    let second = b[sortDescriptor.column]
                    let cmp = (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1

                    if (sortDescriptor.direction === "descending") {
                        cmp *= -1
                    }

                    return cmp
                }),
            }
        },
    })

    const filteredItems = useMemo(() => {
        if (!date) return list.items

        //REVISAR (revisar item.date si es que va a existir)
        const selectedDateStr = date.toDate?.().toISOString().slice(0, 10)
        return list.items.filter(item => item.date === selectedDateStr)
    }, [date, list.items])

    const pages = Math.ceil(list.items.length / rowsPerPage)

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredItems.slice(start, end)
    }, [page, filteredItems])

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
                        aria-label="Example table with client side sorting"
                        isHeaderSticky
                        className='h-full max-h-full w-full'
                        removeWrapper
                        maxTableHeight={200}
                        color='primary'
                        sortDescriptor={list.sortDescriptor}
                        onSortChange={list.sort}
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
                    >
                        <TableHeader>
                            <TableColumn key="date" allowsSorting>Fecha</TableColumn>
                            <TableColumn key="name" allowsSorting>Responsable</TableColumn>
                            <TableColumn key="role" allowsSorting>USD</TableColumn>
                            <TableColumn key="status" allowsSorting>ARS</TableColumn>
                            <TableColumn key="key" allowsSorting>Acciones</TableColumn>
                        </TableHeader>
                        <TableBody
                            isLoading={isLoading}
                            items={items}
                            loadingContent={<Spinner label="Loading..." />}
                        >
                            {(item) => (
                                <TableRow key={item.name}>
                                    {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
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