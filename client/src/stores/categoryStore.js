import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '../utils/constants'
import { useAuthStore } from './authStore'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const authStore = useAuthStore()

    async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const data = await response.json();
        
        // REPARĂ AICI: Ne asigurăm că data este un Array
        // Dacă serverul trimite eroare, data ar putea fi { error: '...' }
        categories.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Fetch categories error:', error);
        categories.value = []; // Resetăm la array gol în caz de eroare gravă
    }
    }

    async function addCategory(name) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ name })
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Failed');

        // REPARĂ AICI: Adăugăm obiectul NOU în array-ul EXISTENT
        // Nu face categories.value = data; (asta ar transforma array-ul în obiect)
        categories.value.push(data); 
        
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
    }
  
  

  async function removeCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })
      if (response.ok) categories.value = categories.value.filter(c => c.id !== id)
    } catch (error) { console.error('Delete category error:', error) }
  }

  return { categories, fetchCategories, removeCategory, addCategory }
})