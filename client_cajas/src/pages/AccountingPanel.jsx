import { useEffect, useMemo, useState } from "react"
import useAccountingLedgerStore from "../store/useAccountingLedgerStore"
import TrendKPICard from "../components/AccountingPanel/TrendKPICard"
import InfoKPICard from "../components/AccountingPanel/InfoKPICard"
import { formatCurrency } from '../tools/utils'
import LedgerTable from "../components/AccountingPanel/LedgerTable"
import InOutGraph from "../components/AccountingPanel/InOutGraph"
import CakeGraph from "../components/AccountingPanel/CakeGraph"

const mockRows = [
    {
        id: 1,
        date: '2025-11-01',
        amountArs: 150000,
        amountUsd: 200,
        balanceArsAfter: 450000,
        balanceUsdAfter: 1200
    },
    {
        id: 2,
        date: '2025-11-02',
        amountArs: -50000,
        amountUsd: 0,
        balanceArsAfter: 400000,
        balanceUsdAfter: 1200
    }
]

const AccountingDashboard = () => {
    const [lastAccountingLedger, setLastAccountingLedger] = useState()
    const [last30DaysAccountingLedger, set30DaysAccountingLedger] = useState()
    const [last30DaysArsBalance, setLast30DaysArsBalance] = useState(0)
    const [last30DaysUsdBalance, setLast30DaysUsdBalance] = useState(0)
    const [last60DaysArsBalance, setLast60DaysArsBalance] = useState(0)
    const [last60DaysUsdBalance, setLast60DaysUsdBalance] = useState(0)
    const [last60DaysAccountingLedger, set60DaysAccountingLedger] = useState()
    const { ledgers, pagination, fetchLastAccountingLedger, fetchPaginatedLedger, fetchLedgerByRange } = useAccountingLedgerStore()

    useEffect(() => {
        const loadLastAccountingLedger = async () => {
            await fetchPaginatedLedger()

            const dataLastAccountingLedger = await fetchLastAccountingLedger()
            setLastAccountingLedger(dataLastAccountingLedger)

            const today = new Date()
            const thirtyDaysAgo = new Date(today)
            thirtyDaysAgo.setDate(today.getDate() - 30)
            const sixtyDaysAgo = new Date(today)
            sixtyDaysAgo.setDate(today.getDate() - 60)

            const last30DaysData = await fetchLedgerByRange()
            const previousMonthData = await fetchLedgerByRange(sixtyDaysAgo.toISOString().split('T')[0], thirtyDaysAgo.toISOString().split('T')[0])
            set30DaysAccountingLedger(last30DaysData)
            set60DaysAccountingLedger(previousMonthData)
        }

        loadLastAccountingLedger()
    }, [])

    // useEffect(() => {
    //     console.log("303030", last30DaysAccountingLedger)
    // }, [last30DaysAccountingLedger])

    // useEffect(() => {
    //     console.log("606060", last60DaysAccountingLedger)
    // }, [last60DaysAccountingLedger])

    useMemo(() => {
        if (!last30DaysAccountingLedger || last30DaysAccountingLedger.length === 0) return
        setLast30DaysArsBalance(last30DaysAccountingLedger[last30DaysAccountingLedger.length - 1].balance_ars_after - (last30DaysAccountingLedger[0].balance_ars_after - last30DaysAccountingLedger[0].amount_ars))
        setLast30DaysUsdBalance(last30DaysAccountingLedger[last30DaysAccountingLedger.length - 1].balance_usd_after - (last30DaysAccountingLedger[0].balance_usd_after - last30DaysAccountingLedger[0].amount_usd))
    }, [last30DaysAccountingLedger])

    useMemo(() => {
        if (!last60DaysAccountingLedger || last60DaysAccountingLedger.length === 0) return
        setLast60DaysArsBalance(last60DaysAccountingLedger[last60DaysAccountingLedger.length - 1].balance_ars_after - (last60DaysAccountingLedger[0].balance_ars_after - last60DaysAccountingLedger[0].amount_ars))
        setLast60DaysUsdBalance(last60DaysAccountingLedger[last60DaysAccountingLedger.length - 1].balance_usd_after - (last60DaysAccountingLedger[0].balance_usd_after - last60DaysAccountingLedger[0].amount_usd))
    }, [last60DaysAccountingLedger])

    return (
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <InfoKPICard title="Pesos Argentinos" value={`$ ${formatCurrency(lastAccountingLedger?.balance_ars_after || 0)}`} />
                    <InfoKPICard title="Dolares" value={`$ ${formatCurrency(lastAccountingLedger?.balance_usd_after || 0)}`} />
                    <TrendKPICard 
                        title="Ingresos ARS" 
                        period="Últimos 30 días"
                        value={`$ ${formatCurrency(last30DaysArsBalance || 0)}`}
                        change={(last30DaysArsBalance || 0) - (last60DaysArsBalance || 0)} 
                        changeType={((last30DaysArsBalance || 0) - (last60DaysArsBalance || 0) >= 0) ? "positive" : "negative"}
                        trendType={((last30DaysArsBalance || 0) - (last60DaysArsBalance || 0) >= 0) ? "up" : "down"}
                    />
                    <TrendKPICard 
                        title="Ingresos USD"
                        period="Últimos 30 días"
                        value={`$ ${formatCurrency(last30DaysUsdBalance || 0)}`}
                        change={(last30DaysUsdBalance || 0) - (last60DaysUsdBalance || 0)} 
                        changeType={((last30DaysUsdBalance || 0) - (last60DaysUsdBalance || 0) >= 0) ? "positive" : "negative"}
                        trendType={((last30DaysUsdBalance || 0) - (last60DaysUsdBalance || 0) >= 0) ? "up" : "down"}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* <InOutGraph /> */}
                        <LedgerTable />
                    </div>

                    <div className="space-y-6">
                        {/* <CakeGraph />
                        <CakeGraph /> */}
                    </div>
                </div>

            </div>
        </div>
    )
}

const InfoCard = ({ title, value }) => (
    <div className="rounded-2xl shadow-sm p-4 flex flex-col justify-between">
        <span className="text-xs font-medium ">{title}</span>
        <span className="mt-3 text-lg md:text-xl font-semibold">
            {value}
        </span>
    </div>
)

const LegendItem = ({ colorClass, label, value }) => (
    <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${colorClass}`} />
            <span>{label}</span>
        </div>
        <span className="">{value}</span>
    </div>
)

export default AccountingDashboard
