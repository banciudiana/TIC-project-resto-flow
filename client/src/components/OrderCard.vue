<template>
  <div 
    class="order-card" 
    :class="statusClass"
    @contextmenu.prevent="$emit('contextmenu', $event, order)"
    @click="$emit('click', order)"
  >
    <div class="card-header">
      <span class="table-badge">TABLE {{ order.tableNumber }}</span>
      <span class="order-time">{{ formattedTime }}</span>
    </div>

    <div class="card-body">
      <ul class="items-preview">
        <li v-for="(item, index) in order.items.slice(0, 3)" :key="index">
          • {{ item.name }}
        </li>
        <li v-if="order.items.length > 3" class="more-items">
          + {{ order.items.length - 3 }} more...
        </li>
      </ul>
    </div>

    <div class="card-footer">
      <span class="total-amount">{{ order.totalAmount }} RON</span>
      <div class="status-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

defineEmits(['contextmenu', 'click'])

const statusClass = computed(() => `status-${props.order.status.toLowerCase()}`)

const formattedTime = computed(() => {
  if (!props.order.createdAt) return ''
  const date = new Date(props.order.createdAt)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<style scoped>
.order-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border-left: 6px solid #ccc;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 1rem;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.table-badge {
  background: var(--color-primary);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.9rem;
}

.order-time {
  font-size: 0.75rem;
  color: #888;
}

.items-preview {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #444;
}

.more-items {
  font-size: 0.8rem;
  color: #999;
  font-style: italic;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid #eee;
}

.total-amount {
  font-weight: 800;
  color: #333;
}

.status-pending { border-left-color: #f1c40f; }
.status-cooking { border-left-color: #e67e22; }
.status-ready { border-left-color: #2ecc71; }
.status-delivered { border-left-color: #3498db; opacity: 0.7; }

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
}
</style>