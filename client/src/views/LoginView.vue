<template>
  <div class="login-container">
    <div class="login-card">
      <h1>RestoFlow Login</h1>
      

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="nume@restaurant.com"
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            required 
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <BaseButton 
          type="submit" 
          variant="primary" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue' 

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  isLoading.value = true

  try {
   
    await authStore.login(email.value, password.value)
    

    if (authStore.isOwner) {
      router.push('/owner-view')
    } else if (authStore.user?.role === 'ROLE_WAITER') {
      router.push('/waiter') 
    } else if (authStore.user?.role === 'ROLE_CHEF') {
      router.push('/chef-dashboard') 
    } else {
      
      router.push('/staff-home')
    }
  } catch (error) {
    
    errorMessage.value = error.message || 'Error during login. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

h1 {
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}



.login-form {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 8px
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #170d87;
  font-weight: bold;

}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #eac10d;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.error-message {
  background: #fff5f5;
  color: #e53e3e;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #e53e3e;
  font-size: 0.9rem;
}
</style>