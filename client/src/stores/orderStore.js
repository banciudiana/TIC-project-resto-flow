
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '../utils/constants'
import { useAuthStore } from './authStore'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const authStore = useAuthStore()

  async function fetchOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
      const data = await response.json()
      orders.value = response.ok ? data : []
    } catch (error) {
      console.error('Fetch orders error:', error)
    }
  }

  async function createOrder(tableNumber, notes) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ tableNumber, notes })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create order')
      
      orders.value.push(data)
      return data 
    } catch (error) {
      console.error('Create order error:', error)
      throw error
    }
  }

  async function addProductToOrder(orderId, productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/add-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ productId })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to add product')


      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) orders.value[index] = { ...orders.value[index], ...data }
      
      return data
    } catch (error) {
      console.error('Add product error:', error)
      throw error
    }
  }

  return { orders, fetchOrders, createOrder, addProductToOrder }
})