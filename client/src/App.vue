<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()


onMounted(() => {
  authStore.checkAuth()
})

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header>
    <div class="logo-section">
       <span class="logo-text">Resto<span>Flow</span></span>
    </div>

    <nav>
      <RouterLink v-if="authStore.isAuthenticated" to="/home">Meniu</RouterLink>
      
      <!-- <RouterLink v-if="authStore.user?.role === 'ROLE_OWNER'" to="/register">
        Adaugă Personal
      </RouterLink> -->

      <div class="auth-section">
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/" class="login-link">Login</RouterLink>
        </template>

        <template v-else>
          <span class="user-info">
            {{ authStore.user?.email }} 
            <small>({{ authStore.user?.role }})</small>
          </span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </template>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background: var(--color-primary); 
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  color: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

.logo-text span {
  color: var(--color-accent); 
}

nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 20px;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.2); 
}

.user-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
}

.user-info small {
  display: block;
  color: var(--color-accent);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.7rem;
}

.logout-btn {
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent); 
  padding: 6px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: var(--color-accent);
  color: var(--color-primary); 
}

nav a {
  text-decoration: none;
  color: white;
  font-weight: 600;
  opacity: 0.8;
}

nav a:hover, 
nav a.router-link-exact-active {
  opacity: 1;
  color: var(--color-accent); 
}
</style>