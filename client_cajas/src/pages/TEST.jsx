import { useEffect, useState } from "react"
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, CardHeader, DateInput, Spinner, Divider, Input, TimeInput } from "@heroui/react"
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date"
import { Time } from "@internationalized/date"

function extractDataFromPdfContent(content) {
    const regex = /Apellido y Nombre:\s*(.*?)\s*Teléfono[\s\S]*?Solicitante:\s*(.*?)\s*\nNombre Prestador/
    const match = content.match(regex)

    let patientName = match[1].trim()
    let medicName = match[2].trim()

    return { patientName, medicName }
}

export const medics = [
    { id: "SIUFIL", label: "Siufi Lucas", key: "SIUFI LUCAS" },
    { id: "SIUFIL", label: "Siufi Lucas", key: "SIUFI ERNESTO" }, //Cambiado a Dr Lucas por que Dr Ernesto no opera
    { id: "JURE", label: "Jure Francisco", key: "JURE" },
    { id: "ABUD", label: "Abud Valeria", key: "ABUD" },
    { id: "ALCOBA", label: "Alcoba Emilio", key: "ALCOBA" },
    { id: "DIPIERRI", label: "Dipierri Maite", key: "DIPIERRI" },
    { id: "ZARIFJ", label: "Zarif Jose Luis", key: "ZARIFJ" },
    { id: "ZARIFA", label: "Zarif Agustina", key: "ZARIFA" },
    { id: "TONELLI", label: "Tonelli Mariela", key: "TONELLI" },
    { id: "VALDEZ", label: "Valdez Laura", key: "VALDEZ" }
]

const SuppliesStamps = () => {
    const [pdfFiles, setPdfFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [folderPath, setFolderPath] = useState("C:\\Users\\Gabriel\\Desktop\\Jonathan\\IMPLANTESPDF")
    const [isCharguedPDFs, setIsCharguedPDFs] = useState(false)
    const [successMessage, setSuccessMessage] = useState(null)

    const fetchPDFsFromFolder = async () => {
        setLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            const response = await fetch("http://localhost:5000/api/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ folderPath }),
            })

            if (!response.ok) {
                console.error(response)
                throw new Error(`Error: ${response.statusText}`)
            }

            const data = await response.json()

            let currentTime = new Date()
            currentTime.setHours(7, 30, 0, 0)
            const enrichedFiles = (data.files || []).map((pdf, i) => {
                const randomIncrement = 25 + Math.floor(Math.random() * 21)
                currentTime.setMinutes(currentTime.getMinutes() + randomIncrement)
                const timeForThis = new Date(currentTime)
                const formattedTime = new Time(timeForThis.getHours(), timeForThis.getMinutes())

                return ({
                    ...pdf,
                    id: i,
                    extractedData: extractDataFromPdfContent(pdf.content),
                    extraData: {
                        date: today(getLocalTimeZone()),
                        time: formattedTime
                    }
                })
            })

            setPdfFiles(enrichedFiles)
            setIsCharguedPDFs(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido")
            console.error("Error fetching PDFs:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDate = (id, newDate) => {
        setPdfFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === id
                    ? {
                        ...file,
                        extraData: {
                            ...file.extraData,
                            date: newDate
                        }
                    }
                    : file
            )
        )
    }

    const handleTime = (id, newTime) => {
        setPdfFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === id
                    ? {
                        ...file,
                        extraData: {
                            ...file.extraData,
                            time: newTime
                        }
                    }
                    : file
            )
        )
    }

    const handleMedic = (id, newMedic) => {
        setPdfFiles(prevFiles =>
            prevFiles.map(file =>
                file.id === id
                    ? {
                        ...file,
                        extractedData: {
                            ...file.extractedData,
                            medicName: newMedic
                        }
                    }
                    : file
            )
        )
    }

    const submitPDF = async () => {
        if (pdfFiles.length === 0) return

        setLoading(true)
        setError(null)

        const payload = pdfFiles.map(file => {
            const medic = medics.find(m => m.key === file.extractedData.medicName)
            return {
                filename: file.filename,
                surgeryDate: file.extraData.date,
                surgeryTime: file.extraData.time,
                surgeonID: medic ? medic.id : null
            }
        })

        try {
            const response = await fetch("http://localhost:5000/api/test/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    folderPath,
                    files: payload
                }),
            })

            if (!response.ok) {
                throw new Error(`Error en el servidor: ${response.statusText}`)
            }

            const data = await response.json()
            setSuccessMessage("¡PDFs procesados correctamente!")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido")
            console.error("Error submitPDF:", err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Card className="mb-6">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Procesador de PDFs - Suministros de PAMI</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-2">Ruta de la carpeta:</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        value={folderPath}
                                        onChange={(e) => setFolderPath(e.target.value)}
                                        className="w-full p-2 rounded-lg"
                                        placeholder="C:\Users\Usuario1\Desktop\CarpetaConPDFs\"
                                        isDisabled={isCharguedPDFs}
                                    />
                                    <Button className="min-w-[120px]" color="primary" onPress={fetchPDFsFromFolder} isDisabled={loading || isCharguedPDFs}>
                                        {loading ? <Spinner size="sm" /> : "Cargar PDFs"}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

                        {pdfFiles.length > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">PDFs encontrados: {pdfFiles.length}</h3>
                                </div>

                                {pdfFiles.map((pdf, index) => (
                                    <Card key={index} className="w-full shadow-none">
                                        <CardBody className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-3 flex flex-col">
                                                <span className="text-xs font-medium">Paciente</span>
                                                <div className="font-medium"> {pdf.extractedData.patientName}</div>
                                            </div>
                                            <DateInput
                                                className="max-w-sm col-span-2"
                                                label={"Fecha Cirugía"}
                                                placeholderValue={new CalendarDate(2025, 6, 15)}
                                                value={pdf.extraData.date}
                                                onChange={(newDate) => handleDate(pdf.id, newDate)}
                                            />
                                            <TimeInput
                                                className="col-span-2"
                                                label="Hora cirugía"
                                                value={pdf.extraData.time}
                                                onChange={(newTime) => handleTime(pdf.id, newTime)}
                                            />
                                            <Autocomplete
                                                className="max-w-xs col-span-2"
                                                defaultItems={medics}
                                                label="Cirujano"
                                                placeholder="Selecciona un cirujano"
                                                selectedKey={pdf.extractedData.medicName}
                                                onSelectionChange={(key) => handleMedic(pdf.id, key)}
                                            >
                                                {(medics) => <AutocompleteItem key={medics.key}>{medics.label}</AutocompleteItem>}
                                            </Autocomplete>
                                            <div className="col-span-2 flex justify-between items-center ">
                                                <h4 className="font-medium">{pdf.filename}</h4>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}

                                <div className="flex justify-end items-center my-4">
                                    <Button color="secondary" onPress={() => submitPDF()} disabled={loading}>
                                        Procesar Todos
                                    </Button>
                                </div>
                                {successMessage && (
                                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mt-2">
                                        {successMessage}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default SuppliesStamps