import { addToast, Button, Form } from '@heroui/react'
import useAbacusPatientStore from '../store/useAbacusPatientStore'
import useStudiesStore from '../store/useStudiesStore'
import { parseDate } from "@internationalized/date"
import useMedicStore from '../store/useMedicStore'
import useHealthInsuranceStore from '../store/useHealthInsuranceStore'
import useStudyOrderStore from '../store/useStudyOrderStore'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LoadingPage from "./LoadingPage"
import PatientForm from '../components/RequestStudyCreate/PatientForm'
import StudiesForm from '../components/RequestStudyCreate/StudiesForm'

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
    const [studiesRequested, setStudiesRequested] = useState([])
    const [studiesEyes, setStudiesEyes] = useState({})
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
            setBirthDate(fetchedPatient.fec_nacimiento ? parseDate(fetchedPatient.fec_nacimiento) : null)
            setHealthInsuranceID(fetchedPatient.ConsulPacientesPrestadores[0]?.id_prestadora || null)
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
        setStudiesEyes({})
        setIsFormLocked(true)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)

        const formattedBirthDate = birthDate ? `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(birthDate.day).padStart(2, '0')}` : null
        
        const studiesWithEyes = studiesRequested.map(id => ({
            id,
            eye: studiesEyes[id] || 'BOTH'
        }))

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
            studiesRequested: studiesWithEyes
        }

        try {
            await createStudyOrder(patientToSend)
            addToast({
                title: "Pedido de estudio creado exitosamente",
                color: "success"
            })
            navigate('/pedidos-estudios')
        } catch (error) {
            console.error("Error creating study order:", error)
            addToast({
                title: "Error al crear el pedido",
                description: error.message || "Hubo un problema al procesar el pedido.",
                color: "danger"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = patient && medicId && healthInsuranceId && studiesRequested?.length > 0

    if (isLoadingMedicStore || isLoadingHealthInsuranceStore || isLoadingStudiesStore) return (<LoadingPage />)

    return (
        <div className='bg-white py-2 rounded-2xl'>
            <Form
                className="w-full max-w-6xl mx-auto justify-center items-center space-y-4"
                validationErrors={errors}
                onSubmit={onSubmit}
            >
                <div className="flex w-full">
                    <h3 className="text-lg font-semibold">Nuevo pedido de estudio</h3>
                </div>
                <div className="grid grid-cols-5 gap-8 w-full">
                    <PatientForm
                        patient={patient}
                        idAbacus={idAbacus}
                        setIdAbacus={setIdAbacus}
                        dni={dni}
                        setDNI={setDNI}
                        lastName={lastName}
                        setLastName={setLastName}
                        firstName={firstName}
                        setFirstName={setFirstName}
                        birthDate={birthDate}
                        setBirthDate={setBirthDate}
                        email={email}
                        setEmail={setEmail}
                        healthInsuranceId={healthInsuranceId}
                        setHealthInsuranceID={setHealthInsuranceID}
                        medicId={medicId}
                        setMedicID={setMedicID}
                        notes={notes}
                        setNotes={setNotes}
                        isFormLocked={isFormLocked}
                        searchAbacusPatient={searchAbacusPatient}
                        healthInsurances={healthInsurances}
                        medics={medics}
                    />

                    <StudiesForm
                        studies={studies}
                        studiesRequested={studiesRequested}
                        setStudiesRequested={setStudiesRequested}
                        studiesEyes={studiesEyes}
                        setStudiesEyes={setStudiesEyes}
                        isFormLocked={isFormLocked}
                    />
                </div>
                <div className="flex gap-4 pt-12 justify-between w-full">
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