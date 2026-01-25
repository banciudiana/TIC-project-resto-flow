<template>
  <main class="waiter-view">
    <header class="waiter-header">
      <div class="header-left">
        <h1>WAITER STATION</h1>
        <div class="status-badge">Live orders: {{ orderStore.activeOrders.length }}</div>
        
        <BaseButton variant="accent" class="new-order-btn" @click="openAddOrderModal">
          <span class="plus-icon"></span> NEW ORDER
        </BaseButton>
      </div>
    </header>

    <div class="divider"></div>

 
    <section class="orders-container">
    <OrderKanban 
        :orders="orderStore.activeOrders" 
        @order-click="handleOrderClick"
        @order-contextmenu="handleOrderContext"
    />
    </section>

    <Transition name="fade">
      <div v-if="isNewOrderModalOpen" class="modal-overlay" @click.self="isNewOrderModalOpen = false">
        <div class="modal-content order-modal">
          <header class="modal-header">
            <h2>CREATE NEW ORDER</h2>
            <div class="table-input-group">
              <label>TABLE </label>
              <input v-model="newOrderData.tableNumber" type="number" placeholder="0" class="table-number-input" />
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
                  <div v-for="(item, index) in newOrderData.items" :key="index" class="selected-item">
                    <span class="item-name">{{ item.name }}</span>
                    <div class="item-actions">
                      <strong>{{ item.price }} RON</strong>
                      <button @click="removeFromOrder(index)" class="remove-btn">×</button>
                    </div>
                  </div>
                  <p v-if="newOrderData.items.length === 0" class="empty-hint">No products added.</p>
                </div>
              </div>

              <div class="notes-area">
                <label>Notes / Allergies</label>
                <textarea v-model="newOrderData.notes" placeholder="Ex: No salt, well done..."></textarea>
              </div>

              <div class="order-footer">
                <div class="total-bar">
                  <span>TOTAL</span>
                  <strong>{{ currentTotal }} RON</strong>
                </div>
                <div class="modal-actions-group">
                  <BaseButton 
                    variant="primary" 
                    @click="handleCreateOrder"
                    :disabled="isCreatingOrder"
                  >
                    {{ isCreatingOrder ? 'SENDING...' : 'SEND TO KITCHEN' }}
                  </BaseButton>
                  <BaseButton 
                    variant="secondary" 
                    @click="isNewOrderModalOpen = false"
                    :disabled="isCreatingOrder"
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


  </main>
  <div 
  v-if="menuState.visible" 
  class="custom-context-menu" 
  :style="{ top: menuState.y + 'px', left: menuState.x + 'px' }"
>
  <div class="menu-header">Order #{{ menuState.order.tableNumber }}</div>
  
  <template v-if="menuState.order.status === 'PENDING'">
    <button @click="console.log('Update', menuState.order)">Update Order</button>
    <button @click="deleteOrder" class="delete-opt">Delete Order</button>
  </template>
  
  <button @click="menuState.visible = false">Close</button>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useOrderStore } from '@/stores/orderStore'
import { useProductStore } from '@/stores/productStore'
import { useAuthStore } from '@/stores/authStore'
import BaseButton from '@/components/BaseButton.vue'
import OrderKanban from '@/components/OrderKanban.vue'

const orderStore = useOrderStore()
const prodStore = useProductStore()
const authStore = useAuthStore()

const isNewOrderModalOpen = ref(false)
const searchQuery = ref('')
const sortBy = ref('name_asc')

const newOrderData = reactive({
  tableNumber: '',
  notes: '',
  items: [] 
})

const menuState = reactive({
  visible: false,
  x: 0,
  y: 0,
  order: null
})

onMounted(async () => {
    orderStore.startOrdersListener();

    await prodStore.fetchProducts();
  window.addEventListener('click', () => { menuState.visible = false })
})

onUnmounted(() => {
  orderStore.stopOrdersListener()
})

const filteredProducts = computed(() => {
  const allProducts = prodStore.products || []
  
  let list = allProducts.filter(p => 
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
  return newOrderData.items.reduce((sum, item) => sum + Number(item.price), 0)
})

const addToOrder = (product) => {
  newOrderData.items.push({ ...product })
}

const removeFromOrder = (index) => {
  newOrderData.items.splice(index, 1)
}

const openAddOrderModal = () => {
  newOrderData.tableNumber = ''
  newOrderData.notes = ''
  newOrderData.items = []
  searchQuery.value = ''
  isNewOrderModalOpen.value = true
}

const isCreatingOrder = ref(false)

const handleCreateOrder = async () => {
 
  if (!newOrderData.tableNumber || newOrderData.items.length === 0) {
    alert("Te rugăm să selectezi masa și cel puțin un produs.")
    return
  }

  if (isCreatingOrder.value) return
  isCreatingOrder.value = true

  try {
   
    const createdOrder = await orderStore.createOrder(
      newOrderData.tableNumber, 
      newOrderData.notes
    )

    console.log("Order: ", createdOrder.id);


    for (const item of newOrderData.items) {
      console.log(`Add product ${item.name}...`);
      await orderStore.addProductToOrder(createdOrder.id, item.id);
    }


    isNewOrderModalOpen.value = false;
    alert("Order sent to kitchen!");
    
  } catch (error) {
    console.error("Error creating order:", error);
    alert("Error: " + error.message);
  } finally {
    isCreatingOrder.value = false;
  }
}

const handleOrderClick = (order) => {
  console.log("Order details:", order)
  alert(`Table ${order.tableNumber}\nNotes: ${order.notes || 'No notes'}\nProducts: ${order.items.length}`)
}

const handleOrderContext = (e, order) => {

  menuState.x = e.clientX
  menuState.y = e.clientY
  menuState.order = order
  menuState.visible = true
}


const deleteOrder = async () => {
  if (!confirm(`Are you sure you want to delete the order for table ${menuState.order.tableNumber}?`)) return
  try {

    await orderStore.deleteOrder(menuState.order.id);
    alert(`Order for table ${menuState.order.tableNumber} deleted.`)
    menuState.visible = false
  } catch (e) { alert(e.message) }
}
</script>

<style scoped>
.waiter-view { 
  padding: 2rem; 
  max-width: 1200px; 
  margin: 0 auto; 
}

.waiter-header { 
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

.new-order-btn { 
  width: 100%; 
  max-width: 400px; 
  padding: 1rem; 
  font-size: 1.1rem; 
  font-weight: 800; 
}

.divider { 
  height: 2px; 
  background: linear-gradient(to right, var(--color-accent), transparent); 
  margin: 2rem 0; 
}

.modal-overlay {
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: rgba(0,0,0,0.6); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 3000;
  padding: 1rem;
}

.modal-content { 
  background: white; 
  border-radius: 12px; 
  box-shadow: 0 20px 50px rgba(0,0,0,0.3); 
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}


.order-modal { 
  max-width: 1000px; 
  width: 100%; 
  padding: 0; 
  overflow: hidden; 
}

.modal-header { 
  padding: 1.2rem 1.5rem; 
  background: var(--color-primary); 
  color: white; 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  flex-shrink: 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.table-input-group { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.table-number-input { 
  width: 70px; 
  padding: 8px; 
  border-radius: 6px; 
  border: none; 
  font-weight: bold; 
  text-align: center; 
  font-size: 1.2rem;
}


.order-grid { 
  display: grid; 
  grid-template-columns: 1fr 380px; 
  min-height: 0;
  flex: 1;
  overflow: hidden;
}


.product-picker { 
  padding: 1.5rem; 
  border-right: 1px solid #eee; 
  display: flex; 
  flex-direction: column; 
  min-height: 0;
}

.search-bar { 
  display: flex; 
  gap: 10px; 
  margin-bottom: 1.2rem;
  flex-shrink: 0;
}

.custom-input { 
  flex: 1; 
  padding: 10px; 
  border: 1px solid #ddd; 
  border-radius: 8px; 
}

.sort-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.product-results { 
  flex: 1;
  overflow-y: auto; 
  padding-right: 10px;
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); 
  gap: 12px; 
  align-content: start;
  min-height: 0;
}

.product-card { 
  padding: 1.2rem 1rem; 
  border: 1px solid #eee; 
  border-radius: 10px; 
  cursor: pointer; 
  transition: 0.2s; 
  background: #fdfdfd; 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
  min-height: 80px;
}

.product-card:hover { 
  border-color: var(--color-accent); 
  background: #fffdf5; 
  transform: translateY(-2px); 
  box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
}

.p-name { 
  font-weight: bold; 
  color: #333; 
  font-size: 0.9rem;
}

.p-price { 
  color: var(--color-primary); 
  font-weight: 800; 
  margin-top: 5px; 
}

.order-summary { 
  padding: 1.5rem; 
  background: #f9f9f9; 
  display: flex; 
  flex-direction: column; 
  min-height: 0;
}

.order-summary h3 {
  margin: 0 0 1rem 0;
  flex-shrink: 0;
}


.selected-items-wrapper {
  flex: 1;
  min-height: 0;
  margin-bottom: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.selected-items { 
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.selected-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 10px 0; 
  border-bottom: 1px solid #eee;
  gap: 10px;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.remove-btn { 
  background: #ff4444; 
  color: white; 
  border: none; 
  border-radius: 50%; 
  width: 22px; 
  height: 22px; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
}

.remove-btn:hover {
  background: #cc0000;
}

.notes-area { 
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.notes-area label { 
  display: block; 
  font-size: 0.8rem; 
  font-weight: bold; 
  margin-bottom: 5px; 
  color: #666; 
}

.notes-area textarea { 
  width: 100%; 
  height: 70px; 
  border-radius: 8px; 
  border: 1px solid #ddd; 
  padding: 10px; 
  resize: none;
  font-family: inherit;
}

.order-footer {
  flex-shrink: 0;
  border-top: 2px solid #ddd;
  padding-top: 1rem;
}

.total-bar { 
  display: flex; 
  justify-content: space-between; 
  font-size: 1.5rem; 
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.modal-actions-group { 
  display: flex; 
  gap: 10px; 
}

.modal-actions-group button { 
  flex: 1; 
}

.empty-hint { 
  text-align: center; 
  color: #aaa; 
  margin-top: 2rem; 
  font-style: italic; 
}

.product-results::-webkit-scrollbar,
.selected-items::-webkit-scrollbar {
  width: 8px;
}

.product-results::-webkit-scrollbar-track,
.selected-items::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.product-results::-webkit-scrollbar-thumb,
.selected-items::-webkit-scrollbar-thumb {
  background: var(--color-primary); 
  border-radius: 10px;
}


@media (max-width: 768px) {
  .order-grid {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  .product-picker {
    border-right: none;
    border-bottom: 1px solid #eee;
    max-height: 50vh;
  }

  .order-summary {
    max-height: 50vh;
  }

  .modal-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modal-header h2 {
    font-size: 1.2rem;
  }

  .product-results {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

@media (max-width: 480px) {
  .waiter-view {
    padding: 1rem;
  }

  .header-left h1 {
    font-size: 1.8rem;
  }

  .new-order-btn {
    max-width: 100%;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .product-picker,
  .order-summary {
    padding: 1rem;
  }

  .product-results {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }

  .total-bar {
    font-size: 1.2rem;
  }

  .modal-actions-group {
    flex-direction: column;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.custom-context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  min-width: 180px;
  z-index: 10000;
  border: 1px solid #ddd;
  overflow: hidden;
}

.menu-header {
  padding: 10px 15px;
  background: #f4f4f4;
  font-size: 0.8rem;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  color: #555;
}

.custom-context-menu button {
  width: 100%;
  padding: 12px 15px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.custom-context-menu button:hover {
  background: #f0f7ff;
}

.delete-opt {
  color: #d9534f;
  border-top: 1px solid #eee !important;
}

.delete-opt:hover {
  background: #fff5f5 !important;
}
</style>