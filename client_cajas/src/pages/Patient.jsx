import { useParams } from "react-router-dom"
import { Autocomplete, AutocompleteItem, Button, Form, Input, Textarea } from '@heroui/react'
import { Search } from 'lucide-react'
import usePatientStore from '../store/usePatientStore'
import useMedicStore from '../store/useMedicStore'
import useHealthInsuranceStore from '../store/useHealthInsuranceStore'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import PopUpAlert from "../components/PopUpAlert"

const Patient = () => {
    const [patient, setPatient] = useState()
    const [patientID, setPatienID] = useState()
    const [dni, setDNI] = useState()
    const [isFormLocked, setIsFormLocked] = useState(false)
    const [first_name, setFirstName] = useState()
    const [last_name, setLastName] = useState()
    const [medic_id, setMedicID] = useState()
    const [health_insurance_id, setHealthInsuranceID] = useState()
    const [phone1, setPhone1] = useState()
    const [phone2, setPhone2] = useState()
    const [email, setEmail] = useState()
    const [notes, setNotes] = useState()
    const [isDNILocked, setIsDNILocked] = useState(false)
    const [alertInfo, setAlertInfo] = useState({})
    const [isVisibleAlert, setIsVisibleAlert] = useState(false)
    const { getPatientByID, getPatientByDNI, createPatient, updatePatient } = usePatientStore()
    const { medics, fetchMedics, isLoadingMedicStore, errorMedicStore } = useMedicStore()
    const { healthInsurances, fetchHealthInsurances, isLoadingHealthInsuranceStore, errorHealthInsuranceStore } = useHealthInsuranceStore()
    const navigate = useNavigate()
    const { id } = useParams()
    const errors = {}

    useEffect(() => {
        const getPatient = async () => {
            const fetchedPatient = await getPatientByID(id)

            if (fetchedPatient) {
                setPatient(fetchedPatient) // VER SI BORRO
                setPatienID(fetchedPatient.id)
                setDNI(fetchedPatient.dni)
                setFirstName(fetchedPatient?.first_name)
                setLastName(fetchedPatient?.last_name)
                setMedicID(fetchedPatient.medic_id)
                setHealthInsuranceID(fetchedPatient.health_insurance_id)
                setPhone1(fetchedPatient.phone1 || "")
                setPhone2(fetchedPatient.phone2 || "")
                setEmail(fetchedPatient.email || "")
                setNotes(fetchedPatient.notes || "")
            }
        }
        
        if (id) {
            getPatient()
        } else {
            setIsFormLocked(true)
        }
        
        fetchMedics()
        fetchHealthInsurances()
    }, [])

    useEffect(() => {
        if (isVisibleAlert) {
            const timer = setTimeout(() => {
                setIsVisibleAlert(false)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [isVisibleAlert])

    const searchDNI = (e) => {
        if (e) { e.preventDefault() }

        const getPatient = async () => {
            const fetchedPatient = await getPatientByDNI(dni)

            if (fetchedPatient) {
                setPatient(fetchedPatient)
                setPatienID(fetchedPatient.id)
                setDNI(fetchedPatient.dni)
                setFirstName(fetchedPatient?.first_name)
                setLastName(fetchedPatient?.last_name)
                setMedicID(fetchedPatient.medic_id)
                setPhone1(fetchedPatient.phone1)
                setPhone2(fetchedPatient.phone2)
                setEmail(fetchedPatient.email)
                setNotes(fetchedPatient.notes)
                setIsFormLocked(false)
                setIsVisibleAlert(true)
                setAlertInfo({
                    text: "Se encontraron datos de un paciente para el DNI ingresado.",
                    color: "warning"
                })
            } else {
                setIsFormLocked(false)
                setIsVisibleAlert(true)
                setIsDNILocked(true)
                setAlertInfo({
                    text: "DNI no registrado previamente.",
                    color: "success"
                })
            }
        }

        if (dni) getPatient()
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const patientToSend = { dni, first_name, last_name, medic_id, health_insurance_id, phone1, phone2, email, notes }

        if (id) {
            updatePatient(id, patientToSend)
        } else {
            createPatient(patientToSend)
        }
        
        navigate("/pacientes")
    }

    if (isLoadingMedicStore || isLoadingHealthInsuranceStore) return (<>Cargando...</>)

    return (
        <div>
            <Form
                className="w-full justify-center items-center space-y-4"
                validationErrors={errors}
                onSubmit={onSubmit}
            >
                <div className="flex w-full max-w-5xl">
                    <h3 className="text-lg font-semibold">{patientID ? "Actualizar" : "Nuevo"} paciente</h3>
                </div>
                <div className="grid grid-cols-2 gap-8 w-full max-w-5xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            {patientID ?
                                <Input label="ID del paciente" labelPlacement="outside" placeholder="-" value={patientID} isDisabled />
                                : <></>
                            }
                            <Input
                                isRequired
                                isDisabled={isDNILocked}
                                label="DNI"
                                labelPlacement="outside"
                                name="dni"
                                placeholder="DNI del paciente"
                                color="primary"
                                variant="faded"
                                value={dni}
                                onValueChange={(e) => setDNI(e)}
                                endContent={
                                    !patientID ?
                                        <Button className="flex items-center gap-1" variant="light" isIconOnly onPress={() => searchDNI()}><Search size={20} /></Button>
                                        : <></>}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !patientID) {
                                        e.preventDefault()
                                        searchDNI(e)
                                    }
                                }}
                                isClearable={false}
                            />
                        </div>
                        <div className="flex gap-4">
                            <Input
                                isRequired
                                label="Apellido/s"
                                labelPlacement="outside"
                                name="last_name"
                                placeholder="Apellido/s del paciente"
                                value={last_name}
                                onValueChange={(e) => setLastName(e)}
                                isDisabled={isFormLocked}
                            />
                            <Input
                                isRequired
                                label="Nombre/s"
                                labelPlacement="outside"
                                name="first_name"
                                placeholder="Nombre/s del paciente"
                                value={first_name}
                                onValueChange={(e) => setFirstName(e)}
                                isDisabled={isFormLocked}

                            />
                        </div>
                        <div className="flex gap-4">
                            <Autocomplete
                                label="Medico"
                                labelPlacement="outside"
                                placeholder="Medico"
                                defaultItems={medics}
                                selectedKey={medic_id ? String(medic_id) : null}
                                onSelectionChange={(key) => setMedicID(key ? Number(key) : null)}
                                isDisabled={isFormLocked}
                            >
                                {(medic) => (
                                    <AutocompleteItem key={medic.id}>
                                        {medic.name}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                            <Autocomplete
                                label="Obra social"
                                labelPlacement="outside"
                                placeholder="Obra social"
                                defaultItems={healthInsurances}
                                selectedKey={health_insurance_id ? String(health_insurance_id) : null}
                                onSelectionChange={(key) => setHealthInsuranceID(key ? Number(key) : null)}
                                isDisabled={isFormLocked}
                            >
                                {(healthInsurance) => (
                                    <AutocompleteItem key={healthInsurance.id}>
                                        {healthInsurance.name}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex gap-4">
                            <Input
                                label="Telefono"
                                labelPlacement="outside"
                                name="phone1"
                                placeholder="Telefono del paciente"
                                value={phone1}
                                onValueChange={(e) => setPhone1(e)}
                                isDisabled={isFormLocked}
                            />
                            <Input
                                label="Celular"
                                labelPlacement="outside"
                                name="phone2"
                                placeholder="Celular del paciente"
                                value={phone2}
                                onValueChange={(e) => setPhone2(e)}
                                isDisabled={isFormLocked}
                            />
                        </div>
                        <Input
                            label="Correo electrónico"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Correo electrónico del paciente"
                            value={email}
                            onValueChange={(e) => setEmail(e)}
                            isDisabled={isFormLocked}
                        />
                        <Textarea
                            label="Notas"
                            labelPlacement="outside"
                            name="notes"
                            placeholder="Notas"
                            value={notes}
                            onValueChange={(e) => setNotes(e)}
                            isDisabled={isFormLocked}
                        />
                    </div>
                </div>
                <div className="flex gap-4 pt-12 justify-end w-full max-w-5xl">
                    <div className="flex gap-4">
                        <Button variant="bordered" onPress={() => navigate('/pacientes/')}>Cancelar</Button>
                        <Button className="" color="primary" type="submit">{patientID ? "Actualizar" : "Registrar"} paciente</Button>
                    </div>
                </div>
                {isVisibleAlert &&
                    <PopUpAlert
                        isVisible={isVisibleAlert}
                        setIsVisible={setIsVisibleAlert}
                        text={alertInfo.text}
                        color={alertInfo.color}
                    />
                }
            </Form>
        </div>
    )
}

export default Patient