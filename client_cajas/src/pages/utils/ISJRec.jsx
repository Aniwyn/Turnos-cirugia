import { useEffect, useState } from "react"
import {
    Alert,
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    DateInput,
    Form,
    Input,
    Spinner
} from "@heroui/react"
import { Search } from 'lucide-react'
import { now } from "@internationalized/date"
// import useMedicStore from '../../store/useMedicStore'
import useUtilsStore from '../../store/useUtilsStore'
import precessPdfIsj from "../../tools/precessPdfIsj"
import generateISJPDF from "../../tools/generateISJPDF"

export const medics = [
    { "id": 1, "name": "Agustina Zarif" },
    { "id": 2, "name": "Emilio Alcoba" },
    { "id": 3, "name": "Ernesto Siufi" },
    { "id": 4, "name": "Francisco Jure" },
    { "id": 5, "name": "Jose Zarif" },
    { "id": 6, "name": "Lucas Siufi" },
    { "id": 7, "name": "Maite Dipierri" },
    { "id": 8, "name": "Mariela Tonelli" },
    { "id": 9, "name": "Valeria Abud" },
    { "id": 10, "name": "Veronica Ase" },
    { "id": 12, "name": "Laura Valdez" }
]

export default function App() {
    const [url, setUrl] = useState("")
    const [date, setDate] = useState()
    const [diagnostic, setDiagnostic] = useState()
    const [medic_id, setMedicID] = useState({})
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [alertColor, setAlertColor] = useState("")
    const [alertType2, setAlertType2] = useState("")
    const [alertMessage2, setAlertMessage2] = useState("")
    const [alertColor2, setAlertColor2] = useState("")
    const [pdfData, setPdfData] = useState()
    const [anchorsPDF, setAnchorsPDF] = useState()
    const [medic, setMedic] = useState()
    const [warningState, setWarningState] = useState()
    const [warningMessage, setWarningMessage] = useState("")
    // const { medics, fetchMedics, isLoadingMedicStore, errorMedicStore } = useMedicStore()
    const { fetchPdfIsj, isLoadingUtilsStore } = useUtilsStore()

    const STAMPS = [
        {
            ID: "ASE",
            name: "Dra. Veronica Ase",
            prof: "Médica Cirujana",
            esp: "Esp. Oftalmología",
            mp: "M.P. 3831",
            mp_to_find: "3831",
            medic_id: 10,
            name_to_compare: "ASE ANDREA VERONICA" //check
        },
        {
            ID: "ALCOBA",
            name: "Dr. Emilio E. Alcoba",
            prof: "Médico Especialista",
            esp: "En Oftalmología",
            mp: "M.P. 3971 - M.N. 153821",
            mp_to_find: "3971",
            medic_id: 2,
            name_to_compare: "ALCOBA EMILIO"
        },
        {
            ID: "SIUFIE",
            name: "Dr. Ernesto Siufi",
            prof: "Médico cirujano",
            esp: "Esp. Oftalmología",
            mp: "M.P. 1398",
            mp_to_find: "1398",
            medic_id: 3,
            name_to_compare: "SIUFI ERNESTO" //check
        },
        {
            ID: "SIUFIL",
            name: "Dr. Lucas Siufi",
            prof: "Médico Cirujano",
            esp: "Esp. Oftalmología",
            mp: "M.P. 3280",
            mp_to_find: "3280",
            medic_id: 6,
            name_to_compare: "SIUFI LUCAS" //check
        },
        {
            ID: "ZARIFJ",
            name: "Dr. Jose Luis Zarif",
            prof: "Médico Cirujano",
            esp: "Esp. Oftalmología",
            mp: "M.P. 2010",
            mp_to_find: "2010",
            medic_id: 5,
            name_to_compare: "ZARIF JOSE LUIS" //check
        },
        {
            ID: "ZARIFA",
            name: "Dra. Agustina A. Zarif",
            prof: "Médica cirujana",
            esp: "Esp. Oftalmología",
            mp: "M.P. 4035",
            mp_to_find: "4035",
            medic_id: 1,
            name_to_compare: "ZARIF AGUSTINA"
        },
        {
            ID: "MAITE",
            name: "Dra. Maite Dipierri",
            prof: "Médica Cirujana",
            esp: "Esp. Oftalmología",
            mp: "M.P. 4124",
            mp_to_find: "4124",
            medic_id: 7,
            name_to_compare: "DIPIERRI MAITE"
        },
        {
            ID: "TONELLI",
            name: "Dra. Tonelli Mariela S.",
            prof: "Médica cirujana",
            esp: "Esp. Oftalmología",
            mp: "M.P. 3328",
            mp_to_find: "3328",
            medic_id: 8,
            name_to_compare: "TONELLI MARIELA SUSANA" //check
        },
        {
            ID: "ABUD",
            name: "Dra. Valeria S. Abud",
            prof: "Médica",
            esp: "Esp. Oftalmología",
            mp: "M.P. 4156",
            mp_to_find: "4156",
            medic_id: 9,
            name_to_compare: "ABUD VALERIA SOLEDAD" //check
        },
        {
            ID: "JURE",
            name: "Dr. Francisco J. Jure",
            prof: "Médico oftalmologo",
            esp: "M.P. 2883",
            mp: "",
            mp_to_find: "2883",
            medic_id: 4,
            name_to_compare: "JURE FRANCISCO JOSE" //check
        }
    ]

    useEffect(() => {
        const getUrl = async () => {
            const params = new URLSearchParams(window.location.search)
            const genosurl = params.get("genosurl")
            if (genosurl) {
                await setUrl(genosurl)
                await fetchPDF(genosurl)
            }
        }

        getUrl()
    }, [])

    const handleMedic = (e) => {
        console.log("MEDICOCO: ", e)
        setMedicID(e)
        const foundStamp = STAMPS.find(stamp => stamp.medic_id == e)
        if (foundStamp) {
            setMedic(foundStamp)
            setAlertType2("SELLO ENCONTRADO CORRECTAMENTE")
            setAlertMessage2(`El sello de  ${foundStamp.name} fue encontrado exitosamente.`)
            setAlertColor2("success")
        } else {
            setMedic({})
            setAlertType2("NO SE ENCONTRO SELLO")
            setAlertMessage2(`No se encontro sello para medico con id ${e}.`)
            setAlertColor2("danger")
        }
    }

    const fetchPDF = (urlParam) => {
        const fecthAsyncPDF = async () => {
            setAlertType("")
            setAlertMessage("")
            setAlertColor("default")
            setAlertType2("")
            setAlertMessage2("")
            setAlertColor2("default")
            setMedicID({})

            const urlToFetch = url || urlParam
            if (!urlToFetch) {
                setAlertType("FALTAN DATOS")
                setAlertMessage("Ingrese una URL.")
                setAlertColor("danger")
                return
            }

            const data = await fetchPdfIsj(urlToFetch)
            const { ok, anchors, modifiedPdf, text, type, message, color } = await precessPdfIsj(data)
            setAlertType(type)
            setAlertMessage(message)
            setAlertColor(color)
            if (!ok) return

            setDate(() => now("America/Argentina/Buenos_Aires"))
            setDiagnostic("H531")
            setPdfData(modifiedPdf)
            setAnchorsPDF(anchors)

            const foundStamp = STAMPS.find(stamp => {
                const regex = new RegExp(`(?:MD\\s*-\\s*${stamp.mp_to_find}\\s*-|\\s-\\s*MP\\s*${stamp.mp_to_find})`)
                return regex.test(text)
            })

            if (foundStamp) {
                setMedic(foundStamp)
                setMedicID(foundStamp.medic_id)
                setAlertType2("SELLO ENCONTRADO CORRECTAMENTE")
                setAlertMessage2(`El sello de  ${foundStamp.name} fue encontrado exitosamente.`)
                setAlertColor2("success")

                const nameLineMatch = text.match(/Centro Atenc\.:\s*\n([A-ZÁÉÍÓÚÑ\s]+)\nCLINICA DE OJOS/)
                if (nameLineMatch) {
                    const medicName = nameLineMatch[1].trim()
                    console.log("Médico en línea de abajo: ", medicName, "\nMédico (sello) encontrado: ", foundStamp.name_to_compare)

                    if (medicName.toUpperCase() !== foundStamp.name_to_compare.toUpperCase()) {
                        setWarningMessage("Advertencia: el médico prestador y el medico solicitante no coinciden.")
                        setWarningState(true)
                    } else {
                        setWarningState(false)

                        // BORRAR SOLO PRUEBA
                        // setWarningMessage("Advertencia: el médico prestador y el medico solicitante no coinciden.")
                        // setWarningState(true)
                    }
                } else {
                    // Preguntar si es una alerta esto o sino borrar (las 2 lineas)
                    setWarningMessage("Advertencia: No se encontro segunda Linea")
                    setWarningState(false)

                }
            }
        }

        fecthAsyncPDF()
    }

    const printPDF = async () => {
        const printDate = `${date.day}/${date.month}/${date.year}`
        await generateISJPDF(pdfData, anchorsPDF, printDate, diagnostic, medic)
    }

    return (
        <div className="h-screen w-screen flex flex-row box-content">
            <Card className="w-1/2 m-6">
                <CardHeader className="flex gap-3 justify-center">
                    <h3 className="text-[2rem]">ISJ</h3>
                </CardHeader>
                <CardBody className="px-12 y">
                    <Form className="">
                        <div className="flex items-end gap-2 w-full">
                            <Input
                                label="URL"
                                labelPlacement="outside"
                                placeholder="Link del archivo PDF de ISJ"
                                value={url}
                                onValueChange={setUrl}
                            />
                            <Button isIconOnly className="mx-0 px-0" color="primary" onPress={() => fetchPDF()}>
                                <Search size={20} strokeWidth={2} color="white" />
                            </Button>
                        </div>
                        <div className="w-full mt-10">
                            <div className="flex gap-4 w-full">
                                <DateInput
                                    label="Fecha"
                                    labelPlacement="outside"
                                    value={date}
                                    onChange={setDate}
                                    granularity="day"

                                />
                                <Input
                                    label="Diagnóstico"
                                    labelPlacement="outside"
                                    placeholder="Diagnóstico"
                                    value={diagnostic}
                                    onValueChange={setDiagnostic}
                                />
                            </div>
                            <Autocomplete
                                label="Selecciona un médico"
                                labelPlacement="outside"
                                placeholder="Selecciona un médico"
                                className="mt-4"
                                defaultItems={medics}
                                selectedKey={medic_id ? String(medic_id) : null}
                                onSelectionChange={(key) => handleMedic(key ? Number(key) : null)}
                            >
                                {(medic) => <AutocompleteItem key={medic.id}>{medic.name}</AutocompleteItem>}
                            </Autocomplete>
                        </div>
                        <Button className="w-full mt-10" color="primary" onPress={() => printPDF()}>Imprimir</Button>
                        {
                            warningState && <Alert color="warning" title="ADVERTENCIA" description="El médico prestador y el medico solicitante no coinciden." className="mt-3" />
                        }
                    </Form>
                </CardBody>
            </Card>
            <div className="w-1/2 m-6">
                {alertMessage && <Alert className="mb-4" color={alertColor} title={alertType} description={alertMessage} />}
                {alertMessage2 && <Alert className="mb-4" color={alertColor2} title={alertType2} description={alertMessage2} />}
                {isLoadingUtilsStore && 
                    <div className="flex my-20 justify-center">
                        <Spinner size="lg" label="Cargando PDF..." />
                    </div>
                }
            </div>

        </div>
    )
}