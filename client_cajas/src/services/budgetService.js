import api from './api'

export const getAllBudgets = async () => {
  const res = await api.get('/budget')
  return res.data
}

export const createBudget = async (budget) => {
  const res = await api.post('/budget', budget)
  return res.data
}