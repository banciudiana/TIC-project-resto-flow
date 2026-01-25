<template>
  <div class="kanban-board">
    <div v-for="column in columns" :key="column.id" class="kanban-column">
      <div class="column-header" :class="column.id.toLowerCase()">
        <h3>{{ column.title }}</h3>
        <span class="count-badge">{{ getOrdersByStatus(column.id).length }}</span>
      </div>

      <div class="column-body">
        <OrderCard 
          v-for="order in getOrdersByStatus(column.id)" 
          :key="order.id"
          :order="order"
          @click="$emit('order-click', $event)"
          @order-press-start="$emit('order-press-start', order)"
         @order-press-cancel="$emit('order-press-cancel')"
          @contextmenu="(event, order) => $emit('order-contextmenu', event, order)"
        />
        
        <p v-if="getOrdersByStatus(column.id).length === 0" class="empty-col-msg">
          No orders here
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import OrderCard from './OrderCard.vue'

const props = defineProps({
  orders: {
    type: Array,
    required: true
  }
})

defineEmits(['order-click', 'order-contextmenu','order-press-start', 
  'order-press-cancel'])

const columns = [
  { id: 'PENDING', title: 'Pending' },
  { id: 'COOKING', title: 'Cooking' },
  { id: 'READY', title: 'Ready' },
  { id: 'DELIVERED', title: 'Delivered' }
]


const getOrdersByStatus = (status) => {
  return props.orders.filter(order => order.status === status)
}
</script>

<style scoped>
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 1rem 0;
  min-height: 70vh;
  align-items: start;
}

.kanban-column {
  background: #f1f3f5;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  border: 1px solid #e9ecef;
}

.column-header {
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
}

.column-header h3 {
  margin: 0;
  font-size: 1.1rem;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.count-badge {
  background: rgba(0,0,0,0.1);
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.column-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}


.pending { background: #fdf2a4; color: #856404; }
.cooking { background: #ffe5d0; color: #85420e; }
.ready { background: #d4edda; color: #155724; }
.delivered { background: #e2e3e5; color: #383d41; }

.empty-col-msg {
  text-align: center;
  color: #adb5bd;
  font-style: italic;
  font-size: 0.9rem;
  margin-top: 2rem;
}


.column-body::-webkit-scrollbar { width: 5px; }
.column-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }


@media (max-width: 1100px) {
  .kanban-board { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .kanban-board { grid-template-columns: 1fr; }
}
</style>