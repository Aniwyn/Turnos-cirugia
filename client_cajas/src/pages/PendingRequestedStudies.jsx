import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, Button } from "@heroui/react"
import { Clock } from 'lucide-react'
import useStudyOrderStore from '../store/useStudyOrderStore'
import useAuthStore from '../store/useAuthStore'
import LoadingPage from './LoadingPage'
import StudyCard from '../components/RequestStudies/StudyCard'

const PendingRequestedStudies = () => {
    const navigate = useNavigate()
    const { pendingStudies, fetchPendingOverdueStudies, isLoadingStudyOrderStore, errorStudyOrderStore } = useStudyOrderStore()

    const user = useAuthStore((state) => state.user)
    const ROLE = ['researchtechnician', 'superadmin']

    useEffect(() => {
        // if (!user || ROLE.includes(user.role)) {
        //     navigate('/')
        //     return
        // }

        fetchPendingOverdueStudies()
    }, [])

    // useEffect(() => {
    //     if (!isLoadingStudyOrderStore && pendingStudies.length === 0 && !errorStudyOrderStore) {
    //         navigate('/pedidos-estudios')
    //     }
    // }, [isLoadingStudyOrderStore, pendingStudies, navigate, errorStudyOrderStore])

    if (isLoadingStudyOrderStore) { return <LoadingPage /> }
    if (errorStudyOrderStore) { return <div className="p-4 text-red-500 text-center">{errorStudyOrderStore}</div> }

    const handlePostpone = () => {
        console.log("Posponer estudios")
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Cola de Estudios Pendientes</h1>
            </div>

            <div className="flex items-center justify-center w-full mb-5">
                <Alert
                    title="Atención: Estudios Atrasados"
                    description="Estos estudios corresponden a jornadas anteriores y no fueron finalizados. Por favor, verifique si deben realizarse hoy o informar al secretario."
                    color="warning"
                    variant="faded"
                    endContent={
                        <Button color="warning" size="sm" variant="flat" startContent={<Clock size={20} />} >
                            Posponer
                        </Button>
                    }
                />
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                {pendingStudies.map((studyOrder) => (
                    <StudyCard key={studyOrder.id} study={studyOrder} />
                ))}
            </div>
        </div>
    )
}

export default PendingRequestedStudies
