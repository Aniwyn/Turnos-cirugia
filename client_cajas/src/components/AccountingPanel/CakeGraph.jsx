

const CakeGraph = () => {

    return (
        <div className="border rounded-2xl shadow-sm p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-medium ">
                        Distribución de ingresos
                    </h2>
                    <p className="text-xs">
                        Por concepto
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                {/* Placeholder torta */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-dashed flex items-center justify-center">
                    <span className="text-xs text-center px-2">
                        [ Gráfico de torta Ingresos ]
                    </span>
                </div>

                {/* Leyenda placeholder */}
                <div className="w-full space-y-2 text-xs">
                    <LegendItem colorClass="bg-emerald-400" label="Cobros cirugías" value="50 %" />
                    <LegendItem colorClass="bg-sky-400" label="Pagos coseguros" value="30 %" />
                    <LegendItem colorClass="bg-violet-400" label="Otros ingresos" value="20 %" />
                </div>
            </div>
        </div>
    )
}

const LegendItem = ({ colorClass, label, value }) => (
    <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${colorClass}`} />
            <span>{label}</span>
        </div>
        <span className="">{value}</span>
    </div>
)

export default CakeGraph

/*

<div className="border rounded-2xl shadow-sm p-4 md:p-5">
    <div className="flex items-center justify-between mb-4">
        <div>
            <h2 className="text-sm font-medium">
                Distribución de egresos
            </h2>
            <p className="text-xs">
                Por concepto
            </p>
        </div>
    </div>
    <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border border-dashed flex items-center justify-center">
            <span className="text-xs text-center px-2">
                [ Gráfico de torta Egresos ]
            </span>
        </div>
        <div className="w-full space-y-2 text-xs">
            <LegendItem colorClass="bg-rose-400" label="Honorarios médicos" value="40 %" />
            <LegendItem colorClass="bg-amber-400" label="Gastos operativos" value="35 %" />
            <LegendItem colorClass="bg-slate-400" label="Otros egresos" value="25 %" />
        </div>
    </div>
</div>

*/