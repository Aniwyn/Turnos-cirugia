import { useEffect, useState, useRef } from "react"
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
import useMedicStore from '../../store/useMedicStore'
import useUtilsStore from '../../store/useUtilsStore'
import precessPdfIsj from "../../tools/precessPdfIsj"
import generateISJPDF from "../../tools/generateISJPDF"

export const medics2 = [
    { id: "SIUFIL", label: "Siufi Lucas", key: "SIUFI LUCAS" },
    { id: "SIUFIE", label: "Siufi Ernesto", key: "SIUFI ERNESTO" },
    { id: "JURE", label: "Jure Francisco", key: "JURE FRANCISCO" },
    { id: "ABUD", label: "Abud Valeria", key: "ABUD VALERIA" },
    { id: "ALCOBA", label: "Alcoba Emilio", key: "ALCOBA" },
    { id: "DIPIERRI", label: "Dipierri Maite", key: "DIPIERRI" },
    { id: "ZARIFJ", label: "Zarif Jose Luis", key: "ZARIF JOSE" },
    { id: "ZARIFA", label: "Zarif Agustina", key: "ZARIFA" },
    { id: "TONELLI", label: "Tonelli Mariela", key: "TONELLI" },
    { id: "ASE", label: "Ase Verónica", key: "ASE VERONICA" },
    { id: "VALDEZ", label: "Valdez Laura", key: "VALDEZ" }
]

export default function App() {
    const [url, setUrl] = useState("")
    const [date, setDate] = useState()
    const [diagnostic, setDiagnostic] = useState()
    const [medic_id, setMedicID] = useState({})
    const [alertType, setAlertType] = useState("")
    const [alertMessage, setAlertMessage] = useState("")
    const [alertColor, setAlertColor] = useState("")
    const [pdfData, setPdfData] = useState()
    const [anchorsPDF, setAnchorsPDF] = useState()
    const [medic, setMedic] = useState()
    const [warningState, setWarningState] = useState()
    const [warningMessage, setWarningMessage] = useState("")
    const { medics, fetchMedics, isLoadingMedicStore, errorMedicStore } = useMedicStore()
    const { pdf_isj, fetchPdfIsj } = useUtilsStore()
    const contentRef = useRef(null)

    const STAMPS = [
        {
            ID: "ASE",
            name: "Dra. Veronica Ase",
            prof: "Médica cirujana",
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
            prof: "Médico cirujano",
            esp: "Esp. Oftalmología",
            mp: "M.P. 3280",
            mp_to_find: "3280",
            medic_id: 6,
            name_to_compare: "SIUFI LUCAS" //check
        },
        {
            ID: "ZARIFJ",
            name: "Dr. Jose Luis Zarif",
            prof: "Médico cirujano",
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
            prof: "Médica cirujana",
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
            esp: "M.P. 4156",
            mp: "",
            mp_to_find: "4156",
            medic_id: 9,
            name_to_compare: "ABUD VALERIA SOLEDAD" //check
        },
        {
            ID: "JURE",
            name: "Dr. Fancisco J. Jure",
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
                //console.log("URL capturada desde la extension: ", genosurl)
                await setUrl(genosurl)
                await fetchPDF(genosurl)
            }
        }

        fetchMedics()
        getUrl()
    }, [])

    const handleMedic = (e) => {
        const selectedMedic = STAMPS.find((stamp) => stamp.name === e)
        if (selectedMedic) {
            setMedic(selectedMedic)
        }
    }

    const fetchPDF = (urlParam) => {
        const fecthAsyncPDF = async () => {
            setAlertType("")
            setAlertMessage("")
            setAlertColor("default")
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
                                onSelectionChange={(key) => setMedicID(key ? Number(key) : null)}
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
                {alertMessage && <Alert color={alertColor} title={alertType} description={alertMessage} />}
            </div>

        </div>
    )



    return (
        <Card className="h-screen w-screen flex flex-row box-content">
            <div className="w-1/2 m-6">
                <Card>
                    <CardHeader
                        color="gray"
                        floated={false}
                        shadow={false}
                        className="m-0 grid place-items-center px-4 py-4 text-center"
                    >
                        <Typography variant="h3" color="white">
                            ISJ
                        </Typography>
                    </CardHeader>
                    <CardBody>
                        <form className="flex flex-col gap-2">
                            <div className="flex flex-row mt-4">
                                <Input
                                    label="URL"
                                    placeholder="http://genos.isj.gov.ar/emision/apraorda5.aspx?12345..."
                                    variant="static"
                                    value={url}
                                    onChange={handleUrl}
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    icon={<UserIcon className="h-4 w-4 text-gray-500" />}
                                />
                                <Button className="ms-4" onClick={handleFetch}>Buscar</Button>
                            </div>
                            <div className="mt-2 grid grid-cols-9 gap-4">
                                <div className="col-span-3">
                                    <Input
                                        label="Diagnostico"
                                        placeholder="H53"
                                        variant="static"
                                        value={diagnostic}
                                        onChange={handleDiagnostic}
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        icon={<DocumentIcon className="h-4 w-4 text-gray-500" />}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Select
                                        variant="static"
                                        label="Médico"
                                        placeholder="Dr. Jose Luis Zarif"
                                        onChange={handleMedic}
                                    >
                                        {STAMPS.map((stamp) => (
                                            <Option key={stamp.ID} value={stamp.name}>
                                                {stamp.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-span-3">
                                    {/*<DataPicker date={date} setDate={setDate} />*/}
                                </div>
                            </div>
                            {
                                warningState ?
                                    <div className="pt-5">
                                        <Alert color="amber">{alertMessage}</Alert>
                                    </div>
                                    :
                                    <></>
                            }
                            <Button className="mt-5" size="lg" onClick={handlePrint}>
                                Imprimir receta
                            </Button>
                        </form>
                        <Alert color="success" title="This is a success alert" description="ADADADAD" />
                    </CardBody>
                </Card>
            </div>
            <div className="flex flex-col justify-center items-center w-1/2" id="preview-content">
                <div className="relative print-content" ref={contentRef} id="preview">
                    <>
                        <p className="absolute top-[378px] left-[220px] w-[120px] text-center text-sm z-[99] text-xs">{(date && pdfData) ? format(date, "dd / MM / yyyy") : ""}</p>
                        <p className="absolute top-[423px] left-[75px] w-[100px] text-center text-sm z-[99] text-xs">{(diagnostic && pdfData) ? diagnostic : ""}</p>
                        <div>
                            <p className="absolute text-[0.8rem] top-[435px] left-[50px] w-[150px] text-center z-[99] text-sm">{(medic.name && pdfData) ? medic.name : ""}</p>
                            <p className="absolute text-[0.6rem] top-[448px] left-[50px] w-[150px] text-center z-[99] text-xs">{(medic.prof && pdfData) ? medic.prof : ""}</p>
                            <p className="absolute text-[0.6rem] top-[457px] left-[50px] w-[150px] text-center z-[99] text-xs">{(medic.esp && pdfData) ? medic.esp : ""}</p>
                            <p className="absolute text-[0.6rem] top-[466px] left-[50px] w-[150px] text-center z-[99] text-xs">{(medic.mp && pdfData) ? medic.mp : ""}</p>
                        </div>
                    </>
                    <div className="relative">
                        {pdfData && false && <PdfPreview file={pdfData} />}
                    </div>
                </div>
            </div>
        </Card>
    )
}