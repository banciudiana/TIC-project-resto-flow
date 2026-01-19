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
  router.push('/login')
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
          <RouterLink to="/login" class="login-link">Login</RouterLink>
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
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #333;
}

.logo-text span {
  color: #42b983; 
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
  border-left: 1px solid #eee;
}

.user-info {
  font-size: 0.9rem;
  color: #666;
}

.user-info small {
  display: block;
  color: #42b983;
  font-weight: bold;
  text-transform: uppercase;
}

.logout-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

nav a {
  text-decoration: none;
  color: #555;
  font-weight: 600;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>