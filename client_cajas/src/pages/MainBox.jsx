import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Button,
    Card,
    CardBody,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell
} from "@heroui/react"
import LoadingPage from "./LoadingPage"
import ErrorPage from "./ErrorPage"
import UnlinkCashBoxForMainBox from "../components/MainBox/UnlinkCashBoxForMainBox"
import ViewAvailableCashBoxes from "../components/MainBox/ViewAvailableCashBoxes"
import ViewCashBoxDetail from "../components/CashBoxes/ViewCashBoxDetail"
import useMainBoxStore from '../store/useMainBoxStore'
import useCashBoxStore from '../store/useCashBoxStore'
import { capitalizeFirstLetter, formatCurrency, formatDateFromDB } from '../tools/utils'
import CloseMainBox from "../components/MainBox/CloseMainBox"

const currencyColorMap = {
    ARS: "primary",
    USD: "warning"
}

const MainBox = () => {
    const [mainBox, setMainBox] = useState({})
    const [cashBoxes, setCashBoxes] = useState([])
    const [sortDescriptor, setSortDescriptor] = useState({})
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const { linkMainBoxById, isLoadingCashBoxStore, errorCashBoxStore } = useCashBoxStore()
    const { fetchMainBoxes, fetchMyActiveMainBox, fetchCashBoxesForMainBox, isLoadingMainBoxStore, errorMainBoxStore } = useMainBoxStore()

    const fetchMainBox = async () => {
        const fetchedMainBox = await fetchMyActiveMainBox()
        if (fetchedMainBox?.id) {
            setMainBox(fetchedMainBox)
            const fetchedCashBoxes = await fetchCashBoxesForMainBox(fetchedMainBox.id)
            setCashBoxes(fetchedCashBoxes)
        }
    }

    useEffect(() => {
        fetchMainBox()
    }, [])

    const summary = useMemo(() => {
        return (cashBoxes ?? []).reduce(
            (acc, { total_ars, total_usd }) => {
                acc.ARS += Number(total_ars ?? 0) || 0
                acc.USD += Number(total_usd ?? 0) || 0
                return acc
            },
            { ARS: 0, USD: 0 }
        )
    }, [cashBoxes])


    const items = useMemo(() => {
        return [...cashBoxes].sort((a, b) => {
            const first = a[sortDescriptor.column]
            const second = b[sortDescriptor.column]
            const cmp = first < second ? -1 : first > second ? 1 : 0

            return sortDescriptor.direction === "descending" ? -cmp : cmp
        })
    }, [cashBoxes, sortDescriptor])

    const renderCell = useCallback((cashBox, columnKey) => {
        const cellValue = cashBox[columnKey]

        switch (columnKey) {
            case "created_at":
                return (<p className="text-small">{formatDateFromDB(cellValue)}</p>)
            case "user_id":
                return (cashBox.user ? <span>{capitalizeFirstLetter(cashBox.user.name)}</span> : <span>ERROR: Usuario no encontrado</span>)
            case "total_ars":
                return (
                    <div className="flex justify-between">
                        <span className="pr-4">$</span>
                        <span>{cashBox.type == "expense" ? "- " : ""}{cellValue ? formatCurrency(cellValue) : "0"}</span>
                    </div>
                )
            case "total_usd":
                return (
                    <div className="flex justify-between">
                        <span className="pr-4">USD</span>
                        <span>{cashBox.type == "expense" ? "- " : ""}{cellValue ? formatCurrency(cellValue) : "0"}</span>
                    </div>
                )
            case "currency":
                return (<Chip color={currencyColorMap[cellValue]} size="sm" variant="flat">{cellValue}</Chip>)
            case "actions":
                return (
                    <div className="relative flex items-center justify-end">
                        <ViewCashBoxDetail boxId={cashBox.id} />
                        <UnlinkCashBoxForMainBox box={cashBox} fetchMainBox={fetchMainBox} />
                    </div>
                )
            default:
                return cellValue
        }
    }, [])

    const linkCashBoxesToMainBox = (selectedKeys) => {
        const asyncSubmit = async () => {
            for (const boxId of selectedKeys) {
                await linkMainBoxById(boxId, mainBox.id)
            }
            await fetchMainBox()
        }

        setLoadingSubmit(true)
        asyncSubmit()
        setLoadingSubmit(false)
    }

    //if (isLoadingCashMovementStore || isLoadingCashBoxStore) return (<LoadingPage />)
    //if (errorCashMovementStore) return (<ErrorPage errorMessage={errorCashMovementStore} />)
    //if (errorCashBoxStore) return (<ErrorPage errorMessage={errorCashBoxStore} />)
    //if (errorMainBoxStore) return (<ErrorPage errorMessage={errorMainBoxStore} />)
    if (Object.keys(mainBox).length === 0) return (<ErrorPage errorMessage="No se encontro una caja general activa para este usuario" />)

    return (
        <div className="flex flex-col gap-6 mx-10">
            <div className="flex justify-end gap-8">
                <Card className="w-full shadow-none">
                    <CardBody className="flex flex-col justify-end p-0">
                        <div className="flex gap-4">
                            <ViewAvailableCashBoxes linkCashBoxesToMainBox={linkCashBoxesToMainBox} loadingSubmit={loadingSubmit} />
                            <CloseMainBox summary={summary} mainBoxId={mainBox?.id} cashBoxes={cashBoxes}/>
                        </div>
                    </CardBody>
                </Card>
                <Card className="relative w-full max-w-70 bg-gradient-to-r from-cyan-300 to-blue-500 text-white overflow-hidden shadow-lg">
                    <CardBody className="bg-[url('/src/assets/circle.svg')] bg-right bg-no-repeat py-4 ps-10">
                        <p className="font-bold">Total ARS</p>
                        <p className="text-2xl">$ {formatCurrency(summary.ARS)}</p>
                    </CardBody>
                </Card>
                <Card className="relative w-full max-w-70 bg-gradient-to-r from-lime-400 to-green-500 text-white overflow-hidden shadow-lg">
                    <CardBody className="bg-[url('/src/assets/circle.svg')] bg-right bg-no-repeat py-4 ps-10">
                        <p className="font-bold">Total USD</p>
                        <p className="text-2xl">USD {formatCurrency(summary.USD)}</p>
                    </CardBody>
                </Card>
            </div>
            <div className="flex flex-row gap-10">
                <Table
                    aria-label="Tabla con movimientos de caja."
                    isHeaderSticky
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    removeWrapper
                >
                    <TableHeader>
                        <TableColumn key="id" width={20}>Caja</TableColumn>
                        <TableColumn key="created_at" width={30} allowsSorting>Fecha de cierre</TableColumn>
                        <TableColumn key="description" width={250}>Descripción</TableColumn>
                        <TableColumn key="user_id" width={80} align="center" allowsSorting>Responsable</TableColumn>
                        <TableColumn key="total_ars" width={80} align="center" allowsSorting>ARS</TableColumn>
                        <TableColumn key="total_usd" width={80} align="center" allowsSorting>USD</TableColumn>
                        <TableColumn key="actions" width={80} align="center">Acciones</TableColumn>
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

export default MainBox