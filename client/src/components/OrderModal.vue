<template>
  <Transition name="fade">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content order-modal">
        <header class="modal-header">
          <h2>{{ initialData ? 'UPDATE ORDER' : 'CREATE NEW ORDER' }}</h2>
          <div class="table-input-group">
            <label>TABLE </label>
            <input 
              v-model="orderData.tableNumber" 
              type="number" 
              placeholder="0" 
              class="table-number-input" 
            />
          </div>
        </header>

        <div class="order-grid">
          <aside class="product-picker">
            <div class="search-bar">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search product..." 
                class="custom-input" 
              />
              <select v-model="sortBy" class="sort-select">
                <option value="name_asc">A-Z</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>

            <div class="product-results">
              <div 
                v-for="prod in filteredProducts" 
                :key="prod.id" 
                class="product-card" 
                @click="addToOrder(prod)"
              >
                <span class="p-name">{{ prod.name }}</span>
                <span class="p-price">{{ prod.price }} RON</span>
              </div>
            </div>
          </aside>

          <section class="order-summary">
            <h3>Current Selection</h3>
            
            <div class="selected-items-wrapper">
              <div class="selected-items">
                <div v-for="(item, index) in orderData.items" :key="index" class="selected-item">
                  <span class="item-name">{{ item.name }}</span>
                  <div class="item-actions">
                    <strong>{{ item.price }} RON</strong>
                    <button @click="removeFromOrder(index)" class="remove-btn">×</button>
                  </div>
                </div>
                <p v-if="orderData.items.length === 0" class="empty-hint">No products added.</p>
              </div>
            </div>

            <div class="notes-area">
              <label>Notes / Allergies</label>
              <textarea v-model="orderData.notes" placeholder="Ex: No salt, well done..."></textarea>
            </div>

            <div class="order-footer">
              <div class="total-bar">
                <span>TOTAL</span>
                <strong>{{ currentTotal }} RON</strong>
              </div>
              <div class="modal-actions-group">
                <BaseButton 
                  variant="primary" 
                  @click="submitOrder"
                  :disabled="loading"
                >
                  {{ loading ? 'SENDING...' : 'SEND TO KITCHEN' }}
                </BaseButton>
                <BaseButton 
                  variant="secondary" 
                  @click="$emit('close')"
                  :disabled="loading"
                >
                  CANCEL
                </BaseButton>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },

  initialData: { type: Object, default: null } 
})

const emit = defineEmits(['close', 'confirm'])

const searchQuery = ref('')
const sortBy = ref('name_asc')

const orderData = reactive({
  tableNumber: props.initialData?.tableNumber || '',
  notes: props.initialData?.notes || '',
  items: props.initialData?.items ? [...props.initialData.items] : []
})

const filteredProducts = computed(() => {
  let list = props.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  list.sort((a, b) => {
    if (sortBy.value === 'name_asc') return a.name.localeCompare(b.name)
    if (sortBy.value === 'price_asc') return a.price - b.price
    if (sortBy.value === 'price_desc') return b.price - a.price
    return 0
  })

  return list
})

const currentTotal = computed(() => {
  return orderData.items.reduce((sum, item) => sum + Number(item.price), 0)
})

const addToOrder = (product) => {
  orderData.items.push({ ...product })
}

const removeFromOrder = (index) => {
  orderData.items.splice(index, 1)
}

const submitOrder = () => {
  if (!orderData.tableNumber || orderData.items.length === 0) {
    alert("Please provide a table number and add at least one product.")
    return
  }

  emit('confirm', { 
    ...orderData, 
    id: props.initialData?.id || null 
  });
}

const modalTitle = computed(() => 
  props.initialData ? `UPDATE ORDER #${props.initialData.tableNumber}` : 'CREATE NEW ORDER'
);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 3000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  display: flex; flex-direction: column;
  max-height: 90vh;
  width: 100%;
  max-width: 1100px;
  overflow: hidden;
}

.modal-header {
  padding: 1.2rem 1.5rem;
  background: var(--color-primary);
  color: white;
  display: flex; justify-content: space-between; align-items: center;
}

.table-number-input {
  width: 70px; padding: 8px; border-radius: 6px; border: none;
  font-weight: bold; text-align: center; font-size: 1.2rem;
}

.order-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  flex: 1; min-height: 0;
}

.product-picker {
  padding: 1.5rem; border-right: 1px solid #eee;
  display: flex; flex-direction: column; min-height: 0;
}

.search-bar { display: flex; gap: 10px; margin-bottom: 1.2rem; }

.custom-input, .sort-select {
  padding: 10px; border: 1px solid #ddd; border-radius: 8px;
}
.custom-input { flex: 1; }

.product-results {
  flex: 1; overflow-y: auto;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.product-card {
  padding: 1rem; border: 1px solid #eee; border-radius: 10px;
  cursor: pointer; transition: 0.2s; background: #fdfdfd;
  display: flex; flex-direction: column; justify-content: space-between;
}

.product-card:hover {
  border-color: var(--color-accent);
  background: #fffdf5; transform: translateY(-2px);
}

.p-name { font-weight: bold; font-size: 0.9rem; }
.p-price { color: var(--color-primary); font-weight: 800; }

.order-summary {
  padding: 1.5rem; background: #f9f9f9;
  display: flex; flex-direction: column; min-height: 0;
}

.selected-items-wrapper { flex: 1; overflow-y: auto; margin-bottom: 1rem; }

.selected-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0; border-bottom: 1px solid #eee;
}

.remove-btn {
  background: #ff4444; color: white; border: none;
  border-radius: 50%; width: 22px; height: 22px; cursor: pointer;
}

.notes-area textarea {
  width: 100%; height: 70px; border-radius: 8px; border: 1px solid #ddd; padding: 10px; resize: none;
}

.total-bar {
  display: flex; justify-content: space-between;
  font-size: 1.5rem; font-weight: 800; margin: 1rem 0;
}

.modal-actions-group { display: flex; gap: 10px; }
.modal-actions-group button { flex: 1; }


@media (max-width: 900px) {
  .order-grid { grid-template-columns: 1fr; grid-template-rows: 1fr 1fr; }
  .modal-content { height: 100%; max-height: 100vh; border-radius: 0; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>