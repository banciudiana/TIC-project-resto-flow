<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {ref ,onMounted } from 'vue'
import { useTableStore } from '@/stores/tableStore'

const authStore = useAuthStore()
const router = useRouter()
const tableStore = useTableStore()
const showTableForm = ref(false)
const tempTableCount = ref(0)

onMounted(async () => {
  authStore.checkAuth()
  await tableStore.fetchTableConfig()
  tempTableCount.value = tableStore.totalTables
})

async function updateTableCount() {
  if (tempTableCount.value < 1) return alert("Min 1 table")
  
  try {
    await tableStore.updateTotalTables(Math.floor(tempTableCount.value))
    showTableForm.value = false
  } catch (error) {
    alert("Error updating tables")
  }
}

async function handleLogout() {
  try {
    const { useOrderStore } = await import('@/stores/orderStore')
    const orderStore = useOrderStore()
    orderStore.stopOrdersListener()

   
    await authStore.logout()
    
    
    await router.replace({ name: 'login' })
    
  } catch (error) {
    console.error("Logout error:", error)

    window.location.href = '/'
  }
}
</script>

<template>
  <header>
    <div class="logo-section">
      <span class="logo-text">Resto<span>Flow</span></span>
    </div>

    <nav>
      <div class="auth-section">
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/" class="login-link">Login</RouterLink>
        </template>

        <template v-else>
          <div v-if="authStore.user?.role === 'ROLE_OWNER'" class="owner-config">
            <button @click="showTableForm = !showTableForm" class="config-toggle-btn">
              TABLES: {{ tableStore.totalTables }}
            </button>
            
            <div v-if="showTableForm" class="mini-form-popover">
              <label>MAX TABLES</label>
              <div class="input-row">
                <input 
                  v-model.number="tempTableCount" 
                  type="number" 
                  min="1" 
                  step="1"
                  @keyup.enter="updateTableCount"
                />
                <button @click="updateTableCount" class="save-mini-btn">SAVE</button>
              </div>
            </div>
          </div>

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

.owner-config {
  position: relative;
  margin-right: 10px;
}

.config-toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px dashed var(--color-accent);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
}

.mini-form-popover {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 1000;
  width: 180px;
  color: #333;
}

.mini-form-popover label {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--color-primary);
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  width: 60px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  font-weight: bold;
}

.save-mini-btn {
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}


.mini-form-popover::after {
  content: '';
  position: absolute;
  top: -6px;
  right: 15px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid white;
}
</style>