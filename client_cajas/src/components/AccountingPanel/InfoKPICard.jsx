import { Card } from "@heroui/react"

const InfoKPICard = ({ title, value }) => {
    return (
        <Card className="dark:border-default-100 border border-transparent">
            <div className="flex p-4">
                <div className="flex flex-col gap-y-2">
                    <dt className="text-small text-default-500 font-medium">{title}</dt>
                    <dd className="text-default-700 text-2xl font-semibold">{value}</dd>
                </div>
            </div>
        </Card>
    )
}

export default InfoKPICard