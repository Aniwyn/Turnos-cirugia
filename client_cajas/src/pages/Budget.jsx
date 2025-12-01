import { useParams } from "react-router-dom"
import { Button, Checkbox, DateInput, Form, Input } from '@heroui/react'
import usePatientStore from '../store/usePatientStore'
import { useEffect, useState } from "react"
import BudgetFormItems from "../components/Budget/BudgetFormItems"
import usePracticeStore from "../store/usePracticeStore"
import useBudgetStore from "../store/useBudgetStore"
import useStampStore from "../store/useStampStore"
import LoadingPage from "./LoadingPage"
import generateBudgetPDF from "../tools/generateBudgetPDF"
import { now } from "@internationalized/date";
import { useNavigate } from "react-router-dom"

const Budget = () => {
    const [addressedTo, setAddressedTo] = useState("HOSPITAL PABLO SORIA")
    const [extraLine, setExtraLine] = useState()
    const [date, setDate] = useState(() => now("America/Argentina/Buenos_Aires"))
    const [patient, setPatient] = useState()
    const [patientID, setPatienID] = useState()
    const [patientDNI, setPatientDNI] = useState()
    const [patientName, setPatientName] = useState()
    const [items, setItems] = useState([{ practiceId: null, quantity: 1, eye: "AO", price: 0, iva: 21 }])
    const [isSelectedStamp, setIsSelectedStamp] = useState(true)
    const { getPatientByID, getPatientByDNI, isLoadingPatientStore, errorPatientStore } = usePatientStore()
    const { practices, fetchPractices, isLoadingPracticeStore, errorPracticeStore } = usePracticeStore()
    const { fetchMyStamp, isLoadingStampStore, errorStampStore } = useStampStore()
    const { createBudget } = useBudgetStore()
    const navigate = useNavigate()
    

    const { id } = useParams()
    if (!id) navigate("/pacientes")
    const errors = {}

    useEffect(() => {
        const getPatient = async () => {
            const fetchedPatient = await getPatientByID(id)

            if (fetchedPatient) {
                setPatient(fetchedPatient)
                setPatienID(fetchedPatient.id)
                setPatientDNI(fetchedPatient.dni)
                setPatientName(`${fetchedPatient?.last_name}, ${fetchedPatient?.first_name}`)
            }
        }

        const getPractices = async () => {
            await fetchPractices()
        }

        getPractices()
        getPatient()
    }, [])

    const toMySQLDate = (budget_date) => {
        const dateObject = new Date(
            budget_date.year,
            budget_date.month - 1,
            budget_date.day
        )

        const yyyy = dateObject.getFullYear()
        const mm = String(dateObject.getMonth() + 1).padStart(2, "0")
        const dd = String(dateObject.getDate()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}`
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const total = items.reduce((acc, item) => {
            const price = parseFloat(item.price) || 0
            const quantity = parseInt(item.quantity) || 0
            const iva = parseFloat(item.iva) || 0
            const subtotal = price * quantity * (1 + iva / 100)

            return acc + subtotal
        }, 0)

        const newBudget = {
            patient_id: patientID,
            patient_dni: patientDNI,
            patient_name: patientName,
            budget_date: toMySQLDate(date),
            validity_days: 30,
            recipient: addressedTo,
            extra_line: extraLine,
            total: total,

            items: items.map(i => {
                const practice = practices.find((l) => l.id == i.practiceId)

                return {
                    practice_id: i.practiceId,
                    practice_name: practice.name,
                    eye: i.eye,
                    quantity: i.quantity,
                    price: i.price,
                    iva: parseFloat(i.iva),
                    code: practice.code,
                    module: practice.module
                }
            }),
        }

        try {
            const saved = await createBudget(newBudget)
            let stamp = {}
            if (isSelectedStamp) {
                stamp = await fetchMyStamp()
            }
            await generateBudgetPDF(saved, isSelectedStamp, stamp)
        } catch (err) {
            console.error("Error guardando presupuesto", err)
        }
    }

    if (isLoadingPracticeStore || isLoadingPatientStore) return (<LoadingPage />)

    return (
        <Form
            className="w-full justify-center items-center space-y-4"
            validationErrors={errors}
            onSubmit={onSubmit}
        >
            <div className="flex w-full max-w-5xl">
                <h3 className="text-lg font-semibold">Datos</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-5xl">
                <div className="flex flex-col gap-4 w-full">
                    <Input
                        isRequired
                        label="Dirigido a:"
                        labelPlacement="outside"
                        name="patient_name"
                        placeholder="Juan Perez"
                        value={addressedTo}
                        onValueChange={(e) => setAddressedTo(e)}
                    />
                    <div className="flex gap-4">
                        <Input
                            label="Linea extra"
                            labelPlacement="outside"
                            placeholder="Linea extra"
                            name="patient_name"
                            value={extraLine}
                            onValueChange={(e) => setExtraLine(e)}
                        />
                        <DateInput
                            label="Fecha del presupuesto"
                            labelPlacement="outside"
                            name="patient_name"
                            value={date}
                            onChange={setDate}
                            granularity="day"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex gap-4">
                        <Input
                            isRequired
                            label="ID del paciente"
                            labelPlacement="outside"
                            name="patient_id"
                            placeholder="ID del paciente"
                            value={patientID}
                            variant="underlined"
                            isReadOnly
                        />
                        <Input
                            isRequired
                            label="DNI"
                            labelPlacement="outside"
                            name="patient_dni"
                            placeholder="DNI del paciente"
                            value={patientDNI}
                            variant="underlined"
                            isReadOnly
                        />
                    </div>
                    <Input
                        isRequired
                        label="Paciente"
                        labelPlacement="outside"
                        name="patient_name"
                        placeholder="Paciente"
                        value={patientName}
                        variant="underlined"
                        isReadOnly
                    />
                </div>
            </div>

            <div className="grid max-w-5xl">
                <BudgetFormItems practices={practices} items={items} setItems={setItems} />
            </div>

            <div className="flex w-full max-w-5xl mt-4 justify-start">
                <Checkbox isSelected={isSelectedStamp} onValueChange={setIsSelectedStamp}>Firmar presupuesto</Checkbox>
            </div>

            <div className="flex gap-4 justify-end w-full max-w-5xl">
                <Button variant="bordered">Cancelar</Button>
                <Button className="" color="primary" type="submit">Crear presupuesto</Button>
            </div>
        </Form>
    )
}

export default Budget