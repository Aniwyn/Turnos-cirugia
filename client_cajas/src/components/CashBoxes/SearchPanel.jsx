import {
    DateInput,
    Input,
    Button
} from "@heroui/react"
import { CircleX } from 'lucide-react'
import useCashBoxStore from '../../store/useCashBoxStore'



const SearchPanel = () => {
    const { fetchCashBoxesPaginated, queryTerms, setQueryTerms } = useCashBoxStore()

    return (
        <div className="flex flex-col gap-2 w-full max-w-60 flex-wrap md:flex-nowrap pt-2">
            <h2 className='font-bold text-center hover-bg-transparent bg-red pb-4'>Filtrar</h2>
            <div className='grid grid-cols-7 items-end'>
                <Input
                    value={queryTerms.id || ""}
                    onChange={(e) => setQueryTerms("id", e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchCashBoxesPaginated() }}
                    className='col-span-6'
                    label="Caja N°"
                    labelPlacement='outside'
                    placeholder='1'
                />
                {queryTerms.id &&
                    <Button
                        onPress={() => setQueryTerms("id", null)}
                        isDisabled={false}
                        className='col-span-1'
                        variant='light'
                        isIconOnly
                    >
                        <CircleX size={18} strokeWidth={3} color='#707070' />
                    </Button>
                }
            </div>
            <div className='grid grid-cols-7 items-end'>
                <DateInput
                    value={queryTerms.start_date || null}
                    onChange={(e) => setQueryTerms("start_date", e)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchCashBoxesPaginated() }}
                    className='col-span-6'
                    label='Desde'
                    labelPlacement='outside'
                />
                {queryTerms.start_date &&
                    <Button
                        onPress={() => setQueryTerms("start_date", null)}
                        isDisabled={false}
                        className='col-span-1'
                        variant='light'
                        isIconOnly
                    >
                        <CircleX size={18} strokeWidth={3} color='#707070' />
                    </Button>
                }
            </div>
            <div className='grid grid-cols-7 items-end'>
                <DateInput
                    value={queryTerms.end_date || null}
                    onChange={(e) => setQueryTerms("end_date", e)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchCashBoxesPaginated() }}
                    className='col-span-6'
                    label='Hasta'
                    labelPlacement='outside'
                />
                {queryTerms.end_date &&
                    <Button
                        onPress={() => setQueryTerms("end_date", null)}
                        isDisabled={false}
                        className='col-span-1'
                        variant='light'
                        isIconOnly
                    >
                        <CircleX size={18} strokeWidth={3} color='#707070' />
                    </Button>
                }
            </div>
            <div className='grid grid-cols-7 items-end'>
                <Input
                    value={queryTerms.description || ""}
                    onChange={(e) => setQueryTerms("description", e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchCashBoxesPaginated() }}
                    className='col-span-6'
                    label="Descripción"
                    labelPlacement='outside'
                    placeholder='Caja de...'
                />
                {queryTerms.description &&
                    <Button
                        onPress={() => setQueryTerms("description", null)}
                        isDisabled={false}
                        className='col-span-1'
                        variant='light'
                        isIconOnly
                    >
                        <CircleX size={18} strokeWidth={3} color='#707070' />
                    </Button>
                }
            </div>

            <Button
                color="primary"
                onPress={() => fetchCashBoxesPaginated()}
                className='mt-20'
            >
                Buscar
            </Button>

        </div>
    )
}

export default SearchPanel