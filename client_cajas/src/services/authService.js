import api from './api'

export const loginUser = async (name, password) => {
    const { data } = await api.post('/users/login', { name, password })
    return data
}

export const checkUserAuth = async () => {
    const { data } = await api.get('/users/auth')
    return data
}