import api from './api'

export const getAllBudgets = async () => {
  const res = await api.get('/budgets')
  return res.data
}

export const createBudget = async (budget) => {
  const res = await api.post('/budgets', budget)
  console.log("111222333", res)
  return res.data
}