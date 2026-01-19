<template>
  <main class="home-container">
    <h1>HOME</h1>
    <p v-if="authStore.user">Logat ca: {{ authStore.user.role }}</p>
      <BaseButton 
           
            variant="primary" 
            :disabled="isLoading"
          >
          
      </BaseButton>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '@/components/BaseButton.vue'
const authStore = useAuthStore()
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

h1 {
  font-size: 3rem;
  color: #42b983;
}
</style>