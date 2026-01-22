import { useQuery } from '@tanstack/react-query'
import { getLastStudyOrders } from '../services/studyOrderService'

export const useGetLastStudyOrders = (limit = 10) => {
    return useQuery({
        queryKey: ['studyOrders', 'last', limit],
        queryFn: () => getLastStudyOrders(limit),
        staleTime: 1000 * 60 * 0.5,
        refetchInterval: 1000 * 60 * 2,
    })
}