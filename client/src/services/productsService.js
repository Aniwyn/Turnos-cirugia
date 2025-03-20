import axios from 'axios'
// const baseUrl = `${import.meta.env.VITE_SERVER}/api/applicants`
const baseUrl = `http://localhost:3000/api/products`

const getAll = async () => {
    const request = axios.get(`${baseUrl}`)
    const response = await request
    return response.data
}

const addProduct = async (product) => {
    const request = axios.post(`${baseUrl}/add`, product)
    const response = await request
    return response
}

const updateProduct = async (product) => {
    const request = axios.put(`${baseUrl}/update`, product)
    const response = await request
    return response
}

const deleteProduct = async (product) => {
    const request = axios.delete(`${baseUrl}/delete`, { data: product })
    const response = await request
    return response
}

const inputRegisters = async () => {
    const request = axios.get(`${baseUrl}`)
    const response = await request
    return response.data
}

export default { getAll, addProduct, updateProduct, deleteProduct }