import { create } from 'zustand'

const useDashboardStore = create((set) => ({
  filters: {
    nameDni: '',
    surgery: '',
    surgeon: '',
    date: ''
  },
  setFilters: (newFilters) => set({ filters: newFilters })
}))

export default useDashboardStore