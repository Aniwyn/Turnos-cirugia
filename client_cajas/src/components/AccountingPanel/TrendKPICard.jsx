import { Card, Chip, cn } from "@heroui/react"
import { TrendingDown, TrendingUp } from "lucide-react"

const data = [
    {
        title: "Total Revenue",
        value: "$228,451",
        change: "33%",
        changeType: "positive",
        trendType: "up",
    },
    {
        title: "Total Expenses",
        value: "$71,887",
        change: "13.0%",
        changeType: "negative",
        trendType: "up",
    },
    {
        title: "Total Profit",
        value: "$156,540",
        change: "0.0%",
        changeType: "neutral",
        trendType: "neutral",
    },
    {
        title: "New Customers",
        value: "1,234",
        change: "1.0%",
        changeType: "positive",
        trendType: "up",
    }
]

const data2 = [
    {
        title: "Monthly Sales",
        value: "$345,892",
        change: "12.5%",
        changeType: "positive",
        trendType: "up",
        trendChipVariant: "flat",
        trendChipPosition: "bottom",
    },
    {
        title: "Operating Costs",
        value: "$98,234",
        change: "18.3%",
        changeType: "negative",
        trendType: "up",
        trendChipVariant: "flat",
        trendChipPosition: "bottom",
    },
    {
        title: "Net Income",
        value: "$247,658",
        change: "15.2%",
        changeType: "neutral",
        trendType: "neutral",
        trendChipVariant: "flat",
        trendChipPosition: "bottom",
    },
    {
        title: "Active Users",
        value: "2,847",
        change: "4.7%",
        changeType: "positive",
        trendType: "up",
        trendChipVariant: "flat",
        trendChipPosition: "bottom",
    }
]

const TrendKPICard = ({
    title,
    value,
    period,
    change,
    changeType,
    trendType,
    trendChipPosition = "top",
    trendChipVariant = "light",
}) => {
    return (
        <Card className="dark:border-default-100 border border-transparent">
            <div className="flex p-4">
                <div className="flex flex-col gap-y-2">
                    <dt className="text-small text-default-500 font-medium">{title}</dt>
                    <dd className="text-default-700 text-2xl font-semibold">{value}</dd>
                </div>
                <small className="absolute right-4 bottom-4 text-gray-500 text-[0.65rem]">
                    {period}
                </small>
                <Chip
                    className={"absolute right-4 top-4"}
                    classNames={{
                        content: "font-medium text-xs",
                    }}
                    color={
                        changeType === "positive" ? "success" : changeType === "neutral" ? "warning" : "danger"
                    }
                    radius="sm"
                    size="sm"
                    startContent={
                        trendType === "up" ? (
                            <TrendingUp height={12} width={12} />
                        ) : trendType === "down" ? (
                            <TrendingDown height={12} width={12} />
                        ) : (<></>)
                    }
                    variant={trendChipVariant}
                >
                    {change}
                </Chip>
            </div>
        </Card>
    )
}

export default TrendKPICard