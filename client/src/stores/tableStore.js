import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './authStore'
import { API_BASE_URL } from '../utils/constants'

export const useTableStore = defineStore('tableStore', () => {
  const totalTables = ref(0)
  const authStore = useAuthStore()

  async function fetchTableConfig() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tables/config`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      const data = await response.json()
      totalTables.value = data.totalTables || 0 
    } catch (error) {
      console.error('Error fetching tables:', error)
    }
  }

    async function updateTotalTables(newCount) {
        const authStore = useAuthStore() 
        const response = await fetch(`${API_BASE_URL}/api/tables/config`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
            },
            body: JSON.stringify({ totalTables: newCount })
        })
        
        if (response.ok) {
            totalTables.value = newCount
        }
    }

  return { totalTables, fetchTableConfig, updateTotalTables }
})