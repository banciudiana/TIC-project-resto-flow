<template>
  <main class="manage-menu-view" @click="closeCtx">
    <header class="header-section">
      <h1>MENU & PRODUCTS</h1>
      <div class="divider"></div>
      <div class="action-buttons">
        <BaseButton variant="primary" @click="openAddCategoryModal">
          Add Category
        </BaseButton>
        <BaseButton variant="accent" @click="openAddProductModal">
          Add Product
        </BaseButton>
      </div>
    </header>

    <div class="menu-container">
      <section v-for="cat in organizedMenu" :key="cat.id" class="category-block">
        <div class="category-header" @contextmenu.prevent="openCtx($event, 'category', cat)">
          <h2>{{ cat.name }}</h2>
          <span class="ctx-hint">Right click to manage category</span>
        </div>
        
        <div class="products-list">
          <div v-for="prod in cat.products" 
               :key="prod.id" 
               class="product-item"
               @contextmenu.prevent="openCtx($event, 'product', prod)">
            <span class="prod-name">{{ prod.name }}</span>
            <span class="prod-dots"></span>
            <span class="prod-price">{{ prod.price }} RON</span>
          </div>
          <p v-if="cat.products.length === 0" class="empty-msg">No products in this category.</p>
        </div>
      </section>

      <section v-if="unassignedProducts.length" class="category-block unassigned">
        <div class="category-header orphan-header">
          <h2>UNASSIGNED PRODUCTS</h2>
          <span class="ctx-hint">Needs a new category</span>
        </div>
        
        <div class="products-list">
          <div v-for="prod in unassignedProducts" 
               :key="prod.id" 
               class="product-item orphan"
               @contextmenu.prevent="openCtx($event, 'product', prod)">
            <span class="prod-name">{{ prod.name }}</span>
            <span class="prod-dots"></span>
            <span class="prod-price">{{ prod.price }} RON</span>
            <span class="warning-tag">! No Category</span>
          </div>
        </div>
      </section>
    </div>

    <Transition name="fade">
      <div v-if="menuState.visible" 
           class="context-menu" 
           :style="{ top: menuState.y + 'px', left: menuState.x + 'px' }">
        
        <template v-if="menuState.type === 'category'">
          <button @click="triggerEditCategory">Update Name</button>
          <button @click="triggerDelete" class="btn-danger">Delete Category</button>
        </template>

        <template v-else>
          <button v-if="isOrphan(menuState.item)" @click="triggerAssignCategory" class="btn-special">
            Assign Category
          </button>
          <button @click="triggerEditProduct">Update Details</button>
          <button @click="triggerDelete" class="btn-danger">Delete Product</button>
        </template>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isAddCategoryModalOpen" class="modal-overlay" @click.self="isAddCategoryModalOpen = false">
        <div class="modal-content">
          <h2>New Category</h2>
          <div class="divider-small"></div>
          
          <div class="form-group">
            <label>Category Name</label>
            <input 
              v-model="newCategoryName" 
              type="text" 
              placeholder="ex: Pizzas, Drinks..." 
              class="custom-input"
              @keyup.enter="handleAddCategory"
            />
          </div>

          <div class="modal-actions">
            <BaseButton variant="primary" @click="handleAddCategory">Create</BaseButton>
            <BaseButton variant="secondary" @click="isAddCategoryModalOpen = false">Cancel</BaseButton>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
    <div v-if="isAssignModalOpen" class="modal-overlay" @click.self="isAssignModalOpen = false">
      <div class="modal-content">
        <h2>Assign Category</h2>
        <p class="info-text">Move <strong>{{ menuState.item?.name }}</strong> to:</p>
        <div class="divider-small"></div>
        
        <div class="form-group">
          <label>Select Category</label>
          <select v-model="selectedCategoryId" class="custom-input">
            <option v-for="cat in catStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="modal-actions">
          <BaseButton variant="primary" @click="handleAssignCategory">Assign</BaseButton>
          <BaseButton variant="secondary" @click="isAssignModalOpen = false">Cancel</BaseButton>
        </div>
      </div>
    </div>
  </Transition>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useProductStore } from '@/stores/productStore'
import BaseButton from '@/components/BaseButton.vue'

const catStore = useCategoryStore()
const prodStore = useProductStore()

const isAddCategoryModalOpen = ref(false)
const newCategoryName = ref('')
const isAssignModalOpen = ref(false)
const selectedCategoryId = ref('')


const menuState = reactive({
  visible: false,
  x: 0,
  y: 0,
  type: '', 
  item: null
})

onMounted(async () => {
  await Promise.all([
    catStore.fetchCategories(),
    prodStore.fetchProducts()
  ])
})

const organizedMenu = computed(() => {
  return catStore.categories.map(cat => ({
    ...cat,
    products: prodStore.products.filter(p => p.category?.id === cat.id)
  }))
})

const unassignedProducts = computed(() => {
  const validCategoryIds = catStore.categories.map(c => c.id)
  return prodStore.products.filter(p => {
    return !p.category || !validCategoryIds.includes(p.category.id)
  })
})

const isOrphan = (product) => {
  if (!product) return false
  const validCategoryIds = catStore.categories.map(c => c.id)
  return !product.category || !validCategoryIds.includes(product.category.id)
}

const openCtx = (e, type, item) => {
  menuState.x = e.clientX
  menuState.y = e.clientY
  menuState.type = type
  menuState.item = item
  menuState.visible = true
}

const closeCtx = () => {
  menuState.visible = false
}

const triggerDelete = async () => {
  const item = menuState.item
  if (menuState.type === 'category') {
    if (confirm(`Delete category "${item.name}"? Products will become unassigned.`)) {
      await catStore.removeCategory(item.id)
    }
  } else {
    if (confirm(`Delete product "${item.name}"?`)) {
      await prodStore.removeProduct(item.id)
    }
  }
  closeCtx()
}


const openAddCategoryModal = () => {
  newCategoryName.value = ''
  isAddCategoryModalOpen.value = true
}

const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return
  try {
    await catStore.addCategory(newCategoryName.value)
    isAddCategoryModalOpen.value = false
    newCategoryName.value = ''
  } catch (error) {
    alert("Error adding category: " + error.message)
  }
}

const triggerAssignCategory = () => {
  selectedCategoryId.value = catStore.categories[0]?.id || ''
  isAssignModalOpen.value = true
  closeCtx()
}

const handleAssignCategory = async () => {
  if (!selectedCategoryId.value) return
  
  try {
  
    const currentItem = menuState.item;

    await prodStore.updateProduct(currentItem.id, {
      name: currentItem.name,
      
      price: Number(currentItem.price), 
      categoryId: selectedCategoryId.value
    })
    
    isAssignModalOpen.value = false
  } catch (error) {
    console.error("Assign Error Details:", error);
    alert("Could not assign category. " + error.message);
  }
}
const openAddProductModal = () => console.log('Add Prod')
const triggerEditCategory = () => console.log('Edit Cat', menuState.item)
const triggerEditProduct = () => console.log('Edit Prod', menuState.item)

</script>

<style scoped>

.manage-menu-view {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.category-block {
  margin-bottom: 3rem;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.category-header h2 {
  color: var(--color-primary);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 1px;
}

.ctx-hint {
  font-size: 0.7rem;
  color: #999;
  font-style: italic;
}

.orphan-header {
  border-bottom-color: #d32f2f;
}
.orphan-header h2 { color: #d32f2f; }

.product-item {
  display: flex;
  align-items: baseline;
  padding: 0.8rem 1rem;
  transition:0.2s;
  cursor: pointer;
  border-radius: 6px;
}

.product-item:hover {
  background: rgba(186, 130, 167, 0.05);
}

.prod-name {
  font-weight: 600;
  color: #333;
}

.prod-dots {
  flex: 1;
  border-bottom: 1px dotted #ccc;
  margin: 0 10px;
}

.prod-price {
  font-weight: 800;
  color: var(--color-primary);
}

.warning-tag {
  color: #d32f2f;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 10px;
  background: #ffebee;
  padding: 2px 6px;
  border-radius: 4px;
}

.empty-msg {
  color: #aaa;
  font-style: italic;
  padding: 1rem;
}

.context-menu {
  position: fixed;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  z-index: 1000;
}

.context-menu button {
  padding: 0.8rem 1.2rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: 0.2s;
}

.context-menu button:hover {
  background: #f8f9fa;
}

.btn-danger { color: #d32f2f; font-weight: 600; }
.btn-special { color: var(--color-accent); font-weight: 600; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.divider-small {
  width: 50px;
  height: 3px;
  background: var(--color-accent);
  margin: 10px auto 20px;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 5px;
}

.custom-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  outline: none;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>