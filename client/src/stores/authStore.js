import { defineStore } from 'pinia';
import { ref, computed } from 'vue'
import { API_BASE_URL } from '../utils/constants'

export const useAuthStore = defineStore('auth', () => {

  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const isOwner = computed(() =>
     user.value?.role === 'ROLE_OWNER')

 


  async function login(email, password) {
    try {
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      user.value = data.user
      token.value = data.token

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function registerStaff(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register-waiter-or-chef`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}` 
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Nu s-a putut înregistra angajatul')
    }

    return data 
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}


  function logout() {
    user.value = null
    token.value = null
    localStorage.clear()
  }

  function checkAuth() {
  const savedToken = localStorage.getItem('authToken')
  const savedUser = localStorage.getItem('authUser')

  if (savedToken && savedUser) {
    token.value = savedToken
    user.value = JSON.parse(savedUser)
  }
}



  return { user, token, isAuthenticated, login, logout, checkAuth, isOwner, registerStaff }
})