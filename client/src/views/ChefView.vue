<template>
  <main class="chef-view">
    <header class="chef-header">
      <div class="header-left">
        <h1>KITCHEN STATION</h1>
        <div class="status-badge">Live orders: {{ orderStore.activeOrders?.length || 0 }}</div>
        
        
      </div>
    </header>

    <div class="divider"></div>

    <section class="orders-container">
      <OrderKanban 
        :orders="orderStore.activeOrders" 
        @order-click="handleStatusToggle" 
      />
    </section>

    <audio ref="notificationSound" src="/sounds/new-order.mp3" preload="auto"></audio>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import OrderKanban from '@/components/OrderKanban.vue'

const orderStore = useOrderStore()
const notificationSound = ref(null)

onMounted(() => {
  orderStore.startOrdersListener()
})

onUnmounted(() => {
  orderStore.stopOrdersListener()
})


watch(() => orderStore.pendingOrders.length, (newCount, oldCount) => {
  if (newCount > oldCount) {
    notificationSound.value?.play().catch(() => {
      console.log("Audio play blocked - needs user interaction first")
    })
  }
})

const handleStatusToggle = async (order) => {
  let nextStatus = ''
  if (order.status === 'PENDING') nextStatus = 'COOKING'
  else if (order.status === 'COOKING') nextStatus = 'READY'
  else return 

  try {
    await orderStore.updateStatus(order.id, nextStatus)
  } catch (error) {
    console.error("Eroare update status:", error)
  }
}
</script>

<style scoped>
  
.chef-view { 
  padding: 2rem; 
  max-width: 1200px; 
  margin: 0 auto; 
}

.chef-header { 
  margin-bottom: 1.5rem; 
}

.header-left { 
  display: flex; 
  flex-direction: column; 
  align-items: flex-start; 
  gap: 1rem; 
}

.header-left h1 { 
  font-size: 2.5rem; 
  color: var(--color-primary); 
  margin: 0; 
  text-transform: uppercase; 
}



.status-badge { 
  background: #e3f2fd; 
  color: #1976d2; 
  padding: 6px 16px; 
  border-radius: 20px; 
  font-weight: 700; 
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
</style>