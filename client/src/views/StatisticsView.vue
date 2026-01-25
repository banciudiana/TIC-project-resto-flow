<template>
  <main class="statistics-view">
    <header class="stats-header">
      <div class="header-left">
        <h1>RESTAURANT STATISTICS</h1>
    
      </div>
      
    </header>

    <section class="quick-access">
      <div class="action-card">
        <div class="action-info">
          <h3>Operations Overview</h3>
          <p>Monitor live orders as they move through the kitchen.</p>
        </div>
        <BaseButton variant="accent" @click="goToKanban">
          VIEW REAL-TIME KANBAN
        </BaseButton>
      </div>
    </section>

    <div class="divider"></div>

    <section class="stats-grid">
      <div class="stats-placeholder">
        <p>Analytical charts will be placed here...</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';

const router = useRouter();

const goToKanban = () => {
  router.push('/owner/live-monitor');
};
</script>

<style scoped>
.statistics-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.stats-header h1 {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin: 0;
  text-transform: uppercase;
}

.quick-access {
  margin-bottom: 2rem;
}

.action-card {
  background: #fff;
  border: 1px solid #eee;
  border-left: 5px solid var(--color-accent);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.action-info h3 {
  margin: 0;
  color: #333;
}

.action-info p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9rem;
}

.divider {
  height: 2px;
  background: linear-gradient(to right, var(--color-accent), transparent);
  margin: 2rem 0;
}

.stats-placeholder {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 4rem;
  text-align: center;
  color: #999;
}
</style>