import { useEffect, useState } from "react"

const SuppliesStamps = () => {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            const url = "http://genos.isj.gov.ar/emision/praopcord.aspx?10506,SCR,350315,56,11911956,0"
            const res = await fetch(url, {
                method: "GET",
            })

            // Si no es texto, forzamos a leer como texto para debug
            const text = await res.text()
            console.log("Respuesta cruda:", text)

            setData(text.slice(0, 500)) // Mostramos los primeros 500 caracteres
        } catch (err) {
            console.error("Error al hacer GET:", err)
            setError(err.message)
        }
    }

    const asd = () => fetchData()

return (
    <div className="p-4">
        <h1 className="text-xl font-bold">Prueba GET Genos</h1>
        <button onClick={asd}>AASDASD</button>
        {error && <p className="text-red-500">Error: {error}</p>}
        {data ? (
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-96">
                {data}
            </pre>
        ) : (
            <p>Cargando...</p>
        )}
    </div>
)
}

export default SuppliesStamps