<template>
  <div class="register-container">
    <div class="register-card">
      <BaseButton variant="accent" class="back-btn" @click="$router.push('/owner-view')">
        ← Back
      </BaseButton>

      <h1>Register New Staff</h1>
      <p class="subtitle">Create an account for a new team member</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>Email Employee</label>
          <input v-model="form.email" type="email" placeholder="email@restaurant.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>

        <div class="form-group">
          <label>Employee Role</label>
          <select v-model="form.role" required>
            <option value="" disabled selected>Selectează un rol</option>
            <option value="ROLE_CHEF">CHEF</option>
            <option value="ROLE_WAITER">Waiter</option>
          </select>
        </div>

        <div v-if="message.text" :class="['message', message.type]">
          {{ message.text }}
        </div>

        <BaseButton type="submit" variant="primary" :disabled="loading">
          {{ loading ? 'Loading...' : 'Create Employee Account' }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '@/components/BaseButton.vue'

const authStore = useAuthStore()
const loading = ref(false)
const message = ref({ text: '', type: '' })

const form = ref({
  email: '',
  password: '',
  role: ''
})

async function handleRegister() {
  loading.value = true
  message.value = { text: '', type: '' }

  try {
    await authStore.registerStaff(form.value)
    message.value = { text: 'Employee registered successfully!', type: 'success' }

    form.value = { email: '', password: '', role: '' }
  } catch (error) {
    message.value = { text: error.message, type: 'error' }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.register-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.back-btn {
  max-width: 100px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
}

h1 { color: var(--color-primary); margin-bottom: 0.5rem; }
.subtitle { color: #666; margin-bottom: 2rem; }

.form-group { margin-bottom: 1.5rem; text-align: left; }
label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--color-primary); }

input, select {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid var(--color-border);
  border-radius: 0.75rem;
  font-size: 1rem;
}

select { cursor: pointer; background-color: white; }

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}
.success { background: #e6fffa; color: #2c7a7b; border: 1px solid #b2f5ea; }
.error { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }
</style>