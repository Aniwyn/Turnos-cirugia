import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Input,
    Button,
    Divider,
    DatePicker
} from "@heroui/react"
import { I18nProvider } from "@react-aria/i18n"
import { Search, Plus, RefreshCw, BrushCleaning } from 'lucide-react'
import useStudyOrderStore from '../store/useStudyOrderStore'
import StudyCard from '../components/RequestStudies/StudyCard'
import { useGetLastStudyOrders } from '../queries/useStudyOrderQuery'
import {getLocalTimeZone, parseDate, today} from "@internationalized/date"

const RequestStudies = () => {
    const [searchResults, setSearchResults] = useState([])
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [dni, setDNI] = useState("")
    const [idAbacus, setIdAbacus] = useState("")
    const [id, setId] = useState("")
    const [date, setDate] = useState(null)

    const { fetchFilteredStudyOrders, isLoadingStudyOrderStore, errorStudyOrderStore } = useStudyOrderStore()
    const { data: lastStudyOrders = [], isLoading: isLoadingLastOrders, refetch, isRefetching } = useGetLastStudyOrders()
    const navigate = useNavigate()

    // useEffect(() => {
    //     verify
    // }, [])

    const handleSearch = async () => {
        if (!lastName && !firstName && !dni && !idAbacus && !id && !date) {
            setSearchResults([])
            return
        }

        const filters = {
            lastName,
            firstName,
            dni,
            idAbacus,
            id,
            date: date ? date.toString() : null
        }
        const results = await fetchFilteredStudyOrders(filters)
        setSearchResults(results || [])
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleNewRequest = () => {
        navigate('/pedidos-estudios/crear')
    }

    const handleClear = () => {
        setLastName("")
        setFirstName("")
        setDNI("")
        setIdAbacus("")
        setId("")
        setDate(null)
        setSearchResults([])
    }

    return (
        <div className="p-4 max-w-7xl mx-auto flex flex-col">
            <div className="flex flex-row justify-between items-end gap-6">
                <div className="flex sm:me-20">
                    <Button
                        color="primary"
                        className="font-medium shadow-sm"
                        startContent={<Plus size={18} />}
                        onPress={() => handleNewRequest()}
                    >
                        Nuevo Pedido
                    </Button>
                </div>
                <div className="flex flex-row w-full gap-2 items-end justify-end">
                    <Input
                        label="ID Estudio"
                        labelPlacement="outside"
                        isClearable
                        value={id}
                        onValueChange={setId}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-22.5"
                    />
                    <Input
                        label="ID Paciente"
                        labelPlacement="outside"
                        isClearable
                        value={idAbacus}
                        onValueChange={setIdAbacus}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-22.5"
                    />
                    <Input
                        label="DNI"
                        labelPlacement="outside"
                        isClearable
                        value={dni}
                        onValueChange={setDNI}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-27.5"
                    />
                    <Input
                        label="Apellido"
                        labelPlacement="outside"
                        isClearable
                        value={lastName}
                        onValueChange={setLastName}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-37.5"
                    />
                    <Input
                        label="Nombre"
                        labelPlacement="outside"
                        isClearable
                        value={firstName}
                        onValueChange={setFirstName}
                        onKeyDown={handleKeyDown}
                        className="w-full max-w-37.5"
                    />
                    <I18nProvider locale="es-AR">
                        <DatePicker
                            label="Fecha"
                            labelPlacement="outside"
                            value={date}
                            onChange={setDate}
                            maxValue={today(getLocalTimeZone())}
                            className="w-full max-w-37.5"
                        />
                    </I18nProvider>
                    <Button color="primary" arialabel="Buscar" startContent={<Search size={16} />} onPress={handleSearch}>
                        Buscar
                    </Button>
                    <Button isIconOnly onPress={handleClear} aria-label="Limpiar filtros">
                        <BrushCleaning color='#666666' size={18}/>
                    </Button>
                </div>
            </div>
            <div className='flex flex-row w-full gap-4 mt-4'>
                <div className='flex flex-col w-full max-w-md'>
                    <div className='mt-4 w-full '>
                        <div className="flex justify-between items-center">
                            <h3 className='text-stone-500 text-sm font-regular'>Últimos Estudios</h3>
                            <Button isIconOnly size="sm" variant="light" onPress={() => refetch()} isDisabled={isLoadingLastOrders || isRefetching}>
                                <RefreshCw size={16} strokeWidth={1.2} className={isRefetching ? "animate-spin" : ""} />
                            </Button>
                        </div>
                        <div className='flex flex-col justify-center gap-2 mt-2'>
                            {lastStudyOrders.map((study) => (
                                <StudyCard key={study.id} study={study} />
                            ))}
                        </div>
                    </div>
                </div>

                <Divider orientation='vertical' className='h-auto my-4' />

                <div className='mt-4 w-full '>
                    <h3 className='text-stone-500 text-sm font-regular'>Resultados de Búsqueda</h3>
                    <div className='flex flex-col justify-center gap-2 sm:max-w-lg mx-auto mt-4'>
                        {searchResults.length > 0 ? (
                            searchResults.map((study, index) => (
                                <StudyCard key={study.id} study={study} />
                            ))
                        ) : (
                            <div className="flex justify-center items-center text-gray-400 italic min-h-75">
                                <p>Sin resultados de busqueda.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default RequestStudies