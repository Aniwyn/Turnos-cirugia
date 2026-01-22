import { addToast, Autocomplete, AutocompleteItem, Button, Checkbox, CheckboxGroup, DateInput, Form, Input, Textarea } from '@heroui/react'
import { Search } from 'lucide-react'
import useAbacusPatientStore from '../store/useAbacusPatientStore'
import useStudiesStore from '../store/useStudiesStore'
import { parseDate } from "@internationalized/date"
import useMedicStore from '../store/useMedicStore'
import useHealthInsuranceStore from '../store/useHealthInsuranceStore'
import useStudyOrderStore from '../store/useStudyOrderStore'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadingPage from "./LoadingPage"

const RequestStudyCreate = () => {
    const [patient, setPatient] = useState()
    const [idAbacus, setIdAbacus] = useState()
    const [dni, setDNI] = useState()
    const [lastName, setLastName] = useState()
    const [firstName, setFirstName] = useState()
    const [birthDate, setBirthDate] = useState()
    const [medicId, setMedicID] = useState()
    const [healthInsuranceId, setHealthInsuranceID] = useState()
    const [email, setEmail] = useState()
    const [notes, setNotes] = useState()
    const [studiesRequested, setStudiesRequested] = useState()
    const [isFormLocked, setIsFormLocked] = useState(false)
    const { healthInsurances, fetchHealthInsurances, isLoadingHealthInsuranceStore, errorHealthInsuranceStore } = useHealthInsuranceStore()
    const { medics, fetchMedics, isLoadingMedicStore, errorMedicStore } = useMedicStore()
    const { studies, fetchStudies, isLoadingStudiesStore, errorStudiesStore } = useStudiesStore()
    const { abacusPatient, fetchAbacusPatientById, fetchAbacusPatientByDNI, isLoadingAbacusPatientStore, errorAbacusPatientStore } = useAbacusPatientStore()
    const { createStudyOrder, isLoadingStudyOrderStore, errorStudyOrderStore } = useStudyOrderStore()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const errors = {}

    useEffect(() => {
        setIsFormLocked(true)

        fetchHealthInsurances()
        fetchMedics()
        fetchStudies()
    }, [])

    const searchAbacusPatient = async (e) => {
        if (e) { e.preventDefault() }

        let fetchedPatient

        if (idAbacus) {
            fetchedPatient = await fetchAbacusPatientById(idAbacus)
        } else if (dni) {
            fetchedPatient = await fetchAbacusPatientByDNI(dni)
        }


        if (fetchedPatient) {
            setPatient(fetchedPatient)
            setIdAbacus(fetchedPatient.id_paciente)
            setDNI(fetchedPatient.Cliente.num_doc)
            setLastName(fetchedPatient.apellido)
            setFirstName(fetchedPatient.nombre)
            setBirthDate(fetchedPatient.fec_nacimiento ? parseDate(fetchedPatient.fec_nacimiento) : null) //string en formato "1995-01-10"
            setHealthInsuranceID(fetchedPatient.ConsulPacientesPrestadores[0].id_prestadora || null)
            setEmail(fetchedPatient.Cliente.mail || "")
            
            addToast({
                title: "Paciente encontrado en Abacus",
                color: "success"
            })
            setIsFormLocked(false)
        } else {
            addToast({
                title: "Paciente no encontrado en Abacus.",
                color: "warning"
            })
        }
    }

    const handleReset = () => {
        setPatient(null)
        setIdAbacus("")
        setDNI("")
        setLastName("")
        setFirstName("")
        setBirthDate(null)
        setMedicID(null)
        setHealthInsuranceID(null)
        setEmail("")
        setNotes("")
        setStudiesRequested([])
        setIsFormLocked(true)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)

        const formattedBirthDate = birthDate ? `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(birthDate.day).padStart(2, '0')}` : null
        const patientToSend = {
            idAbacus,
            dni,
            lastName,
            firstName,
            formattedBirthDate,
            email,
            healthInsuranceId,
            medicId,
            notes,
            studiesRequested
        }

        try {
            await createStudyOrder(patientToSend)
            addToast({
                title: "ENVIADO!!",
                color: "success"
            })
            navigate('/pedidos-estudios')
        } catch (error) {
            addToast({
                title: "Error al enviar",
                description: "Hubo un problema al procesar el pedido.",
                color: "danger"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = patient && medicId && healthInsuranceId && studiesRequested?.length > 0

    if (isLoadingMedicStore || isLoadingHealthInsuranceStore) return (<LoadingPage />)

    return (
        <div>
            <Form
                className="w-full justify-center items-center space-y-4"
                validationErrors={errors}
                onSubmit={onSubmit}
            >
                <div className="flex w-full max-w-5xl">
                    <h3 className="text-lg font-semibold">Nuevo pedido de estudio</h3>
                </div>
                <div className="grid grid-cols-2 gap-8 w-full max-w-5xl">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-end gap-2">
                            <Input
                                isDisabled={dni}
                                label="ID Abacus"
                                labelPlacement="outside"
                                placeholder="12345"
                                color="primary"
                                variant="faded"
                                value={idAbacus}
                                onValueChange={(e) => { setIdAbacus(e) }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        searchAbacusPatient(e)
                                    }
                                }}
                                className="max-w-22"
                            />
                            <Input
                                isDisabled={idAbacus}
                                label="DNI"
                                labelPlacement="outside"
                                name="dni"
                                placeholder="DNI del paciente"
                                color="primary"
                                variant="faded"
                                value={dni}
                                onValueChange={(e) => { setDNI(e) }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        searchAbacusPatient(e)
                                    }
                                }}
                                isClearable={false}
                            />
                            {!patient &&
                                <Button
                                    onPress={(e) => searchAbacusPatient()}
                                    isIconOnly color="primary"
                                    isVisible={false}
                                >
                                    <Search size={20} />
                                </Button>
                            }
                        </div>
                        <div className="flex items-end gap-2">
                            <Input
                                isRequired
                                label="Apellido/s"
                                labelPlacement="outside"
                                name="last_name"
                                placeholder="Apellido/s del paciente"
                                value={lastName}
                                onValueChange={(e) => setLastName(e)}
                                isDisabled
                            />
                            <Input
                                isRequired
                                label="Nombre/s"
                                labelPlacement="outside"
                                name="first_name"
                                placeholder="Nombre/s del paciente"
                                value={firstName}
                                onValueChange={(e) => setFirstName(e)}
                                isDisabled

                            />
                        </div>
                        <div className="flex gap-2 items-end">
                            <DateInput
                                value={birthDate}
                                onChange={setBirthDate}
                                isDisabled
                                label="Fecha de nacimiento"
                                labelPlacement="outside"
                                className="max-w-40"
                            />
                            <Input
                                label="Correo electrónico"
                                labelPlacement="outside"
                                name="email"
                                type="email"
                                placeholder="Email del paciente"
                                value={email}
                                onValueChange={(e) => setEmail(e)}
                                isDisabled={isFormLocked}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Autocomplete
                                isRequired
                                label="Obra social"
                                labelPlacement="outside"
                                placeholder="Obra social"
                                defaultItems={healthInsurances}
                                selectedKey={healthInsuranceId ? String(healthInsuranceId) : null}
                                onSelectionChange={(key) => setHealthInsuranceID(key ? Number(key) : null)}
                                isDisabled={isFormLocked}
                            >
                                {(healthInsurance) => (
                                    <AutocompleteItem key={healthInsurance.abacus_id}>
                                        {healthInsurance.name}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                            <Autocomplete
                                isRequired
                                label="Médico"
                                labelPlacement="outside"
                                placeholder="Médico"
                                defaultItems={medics}
                                selectedKey={medicId ? String(medicId) : null}
                                onSelectionChange={(key) => setMedicID(key ? Number(key) : null)}
                                isDisabled={isFormLocked}
                            >
                                {(medic) => (
                                    <AutocompleteItem key={medic.id}>
                                        {medic.name}
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>
                        </div>
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

                    <div className="flex flex-col gap-4 w-full">

                        <div className="flex flex-col gap-2">
                            <CheckboxGroup
                                isRequired
                                value={studiesRequested}
                                onValueChange={setStudiesRequested}
                                isDisabled={isFormLocked}
                                label="Estudios"
                                classNames={{
                                    wrapper: "grid grid-cols-2 gap-4"
                                }}
                            >
                                {studies?.map((study) => (
                                    <Checkbox key={study.id} value={String(study.id)}>
                                        {study.name}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 pt-12 justify-between w-full max-w-5xl">
                    <div className="flex gap-4">
                        <Button type='button' onPress={handleReset} isDisabled={isSubmitting}>Limpiar</Button>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="bordered" onPress={() => navigate('/pedidos-estudios/')} isDisabled={isSubmitting}>Cancelar</Button>
                        <Button className="" color="primary" type="submit" isDisabled={!isFormValid || isSubmitting} isLoading={isSubmitting}>Solicitar estudio</Button>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default RequestStudyCreate