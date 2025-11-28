

const InOutGraph = () => {
    return (

        <div className="border border-slate-800 rounded-2xl shadow-sm p-4 md:p-5" >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-medium">
                        Ingresos vs Egresos
                    </h2>
                    <p className="text-xs">
                        Últimos 30 días
                    </p>
                </div>
                <div className="text-xs">
                    {/* acá podrías poner filtros de rango de fechas */}
                    Actualizado hoy
                </div>
            </div>

            {/* Contenedor del gráfico (placeholder) */}
            <div className="h-56 md:h-64 lg:h-72 rounded-xl border border-dashed border-slate-700 flex items-center justify-center" >
                <span className="text-xs">
                    [ Gráfico de líneas Ingresos / Egresos ]
                </span>
            </div >
        </div >
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

export default InOutGraph