<template>
  <main class="chef-view"> <header class="chef-header">
      <div class="header-left">
        <h1>LIVE MONITOR</h1>
        
      </div>
      
    </header>

    <div class="divider"></div>

    <section class="orders-container">
      <OrderKanban 
        :orders="orderStore.activeOrders" 
        :is-readonly="true" 
        @order-click="handleShowDetails"
      />
    </section>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import OrderKanban from '@/components/OrderKanban.vue'
import BaseButton from '@/components/BaseButton.vue'

const orderStore = useOrderStore()

onMounted(() => {
  orderStore.startOrdersListener()
})

onUnmounted(() => {
  orderStore.stopOrdersListener()
})

const handleShowDetails = (order) => {
  const productsList = order.items.map(i => `- ${i.name}`).join('\n');
  alert(
    `Table ${order.tableNumber}\n` +
    `Status: ${order.status}\n` +
    `Products:\n${productsList}\n\n` +
    `Notes: ${order.notes || 'No notes'}`
  );
};
</script>

<style scoped>

.chef-view { 
  padding: 2rem; 
  max-width: 1200px; 
  margin: 0 auto; 
}

.chef-header { 
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem; 
}





.status-badge { 
  background: #e3f2fd; 
  color: #1976d2; 
  padding: 6px 16px; 
  border-radius: 20px; 
  font-weight: 700; 
  display: flex;
  align-items: center;
  gap: 8px;
}



.divider { 
  height: 2px; 
  background: linear-gradient(to right, var(--color-accent), transparent); 
  margin: 2rem 0; 
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

:deep(.order-card) {
  cursor: pointer;
  transition: transform 0.2s;
}

:deep(.order-card:hover) {
  transform: scale(1.02);
}


.orders-container {
  overflow-x: auto;
  padding-bottom: 1rem;
}
</style>