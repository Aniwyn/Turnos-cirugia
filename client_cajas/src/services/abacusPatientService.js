import axios from 'axios'

const ABACUS_API_URL = 'http://192.168.0.100:3012/api'

const apiAbacus = axios.create({
    baseURL: ABACUS_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const getAbacusPatientById = async (id) => {
    try {
        console.log(`/consul_pacientes/id/${id}`)
        const response = await apiAbacus.get(`/consul_pacientes/id/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching abacus patient id ${id}: `, error)
        return null
    }
}

export const getAbacusPatientByDNI = async (dni) => {
    try {
        const response = await apiAbacus.get(`/consul_pacientes/dni/${dni}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching abacus patient dni ${dni}: `, error)
        return null
    }
}
