import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '../utils/constants'
import { useAuthStore } from './authStore'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const authStore = useAuthStore()

  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
      products.value = await response.json()
    } catch (error) { console.error('Fetch products error:', error) }
  }



    async function updateProduct(id, updateData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updateData)
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Update failed')

        
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) products.value[index] = data
        
        return data
    } catch (error) {
        console.error('Update product error:', error)
        throw error
    }
    }

    async function addProduct(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(productData)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to create product')
    
    products.value.push(data) 
    return data
  } catch (error) {
    console.error('Add product error:', error)
    throw error
  }
}


  async function removeProduct(id) {
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
      products.value = products.value.filter(p => p.id !== id)
    } catch (error) { console.error('Delete product error:', error) }
  }

  return { products, fetchProducts, removeProduct, updateProduct    , addProduct }
})