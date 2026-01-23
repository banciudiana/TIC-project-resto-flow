import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '../utils/constants'
import { useAuthStore } from './authStore' 

export const useStaffStore = defineStore('staff', () => {
  const staffMembers = ref([])
  const loading = ref(false)
  const authStore = useAuthStore()

  async function fetchStaff() {
    loading.value = true
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/staff`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch staff')
      
      staffMembers.value = data
    } catch (error) {
      console.error('Fetch staff error:', error)
    } finally {
      loading.value = false
    }
  }


  async function removeEmployee(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Delete failed')
      }


      staffMembers.value = staffMembers.value.filter(member => member.id !== userId)
    } catch (error) {
      console.error('Remove staff error:', error)
      throw error
    }
  }


  async function updateEmployee(userId, updatedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updatedData)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Update failed')

      const index = staffMembers.value.findIndex(m => m.id === userId)
      if (index !== -1) {
        staffMembers.value[index] = { ...staffMembers.value[index], ...data }
      }
      return data
    } catch (error) {
      console.error('Update staff error:', error)
      throw error
    }
  }

  return { staffMembers, loading, fetchStaff, removeEmployee, updateEmployee }
})