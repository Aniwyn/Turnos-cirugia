import { useParams } from "react-router-dom"
import { Button, Checkbox, Form, Input } from '@heroui/react'
import { CircleX, Search } from 'lucide-react'
import usePatientStore from '../store/usePatientStore'
import { useEffect, useState } from "react"
import BudgetFormItems from "../components/Budget/BudgetFormItems"
import usePracticeStore from "../store/usePracticeStore"
import useBudgetStore from "../store/useBudgetStore"
import LoadingPage from "./LoadingPage"
import generateBudgetPDF from "../tools/generateBudgetPDF"

const Budget = () => {
    const [addressedTo, setAddressedTo] = useState("HOSPITAL PABLO SORIA")
    const [extraLine, setExtraLine] = useState()
    const [patient, setPatient] = useState()
    const [patientID, setPatienID] = useState()
    const [patientDNI, setPatientDNI] = useState()
    const [patientName, setPatientName] = useState()
    const [items, setItems] = useState([{ practiceId: null, quantity: 1, eye: "AO", price: 0, iva: 21 }])
    const [isSelectedStamp, setIsSelectedStamp] = useState(true)
    const { getPatientByID, isLoadingPatientStore, errorPatientStore } = usePatientStore()
    const { practices, fetchPractices, isLoadingPracticeStore, errorPracticeStore } = usePracticeStore()
    const { createBudget } = useBudgetStore()

    const { id } = useParams()
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
        if (id) { getPatient() }
    }, [])

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
            await generateBudgetPDF(saved)
        } catch (err) {
            console.error("Error guardando presupuesto", err)
        }
    }

    if (isLoadingPracticeStore || isLoadingPatientStore) return (<LoadingPage />)

    return (
        <Form
            className="w-full justify-center items-center space-y-4"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
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
                    <Input
                        label="Linea extra"
                        labelPlacement="outside"
                        name="patient_name"
                        value={extraLine}
                        onValueChange={(e) => setExtraLine(e)}
                    />
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
                            onValueChange={(e) => setPatienID(e)}
                            endContent={<div className="flex items-center gap-1"><Search size={20} /><CircleX size={20} color="red" /></div>}
                        />
                        <Input
                            isRequired
                            label="DNI"
                            labelPlacement="outside"
                            name="patient_dni"
                            placeholder="DNI del paciente"
                            value={patientDNI}
                            onValueChange={(e) => setPatienDNI(e)}
                            isDisabled={patientID ? true : false}
                            endContent={!patientID ? <div className="flex items-center gap-1"><Search size={20} /></div> : <></>}
                        />
                    </div>
                    <Input
                        isRequired
                        label="Paciente"
                        labelPlacement="outside"
                        name="patient_name"
                        placeholder="Paciente"
                        value={patientName}
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
                <Button variant="bordered">Calcelar</Button>
                <Button className="" color="primary" type="submit">Crear presupuesto</Button>
            </div>
        </Form>
    )
}

export default Budget