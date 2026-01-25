<template>
  <main class="owner-container">
    <div class="welcome-header">
      <h1>OWNER DASHBOARD</h1>
      <div class="divider"></div>
      <p>Welcome</p>
    </div>

    <div class="action-cards">
      <div class="card">
        <h3>Staff</h3>
        <p>Register or remove staff members (Chefs/Waiters)</p>
        <BaseButton variant="primary" @click="$router.push('/manage-staff')">
          Manage Staff
        </BaseButton>
      </div>

      <div class="card">
        <h3>Menu & Products</h3>
        <p>Modify prices or add new dishes</p>
        <BaseButton variant="accent" @click="$router.push('/manage-menu')">
          Edit Menu
        </BaseButton>
      </div>

      <div class="card">
        <h3>Reports</h3>
        <p>View sales and restaurant performance</p>
        <BaseButton variant="primary" @click="$router.push('/owner/statistics')"  >
          View Statistics
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '@/components/BaseButton.vue'

const authStore = useAuthStore()
</script>

<style scoped>
.owner-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.welcome-header {
  margin-bottom: 3rem;
}

h1 {
  color: var(--color-primary); 
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.divider {
  width: 80px;
  height: 5px;
  background-color: var(--color-accent); 
  margin: 10px auto;
  border-radius: 2px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(186, 130, 167, 0.05);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

.card h3 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}


@media (max-width: 480px) {
  .action-cards {
    grid-template-columns: 1fr;
  }
}
</style>