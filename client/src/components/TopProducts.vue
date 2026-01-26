<template>
  <div class="top-products-container">
    <div class="header">
      <h3>Top 3 Products</h3>
      <div class="filters">
        <button 
          @click="currentRange = 'week'" 
          :class="{ active: currentRange === 'week' }"
        >WEEK</button>
        <button 
          @click="currentRange = 'month'" 
          :class="{ active: currentRange === 'month' }"
        >MONTH</button>
      </div>
    </div>
    
    <div v-if="topProducts.length > 0" class="products-list">
      <div 
        v-for="(product, index) in topProducts" 
        :key="product.id"
        class="product-card"
        :class="`rank-${index + 1}`"
      >
        <div class="rank-badge">
          
          <span class="rank-number">#{{ index + 1 }}</span>
        </div>
        
        <div class="product-info">
          <h4 class="product-name">{{ product.name }}</h4>
          <div class="product-stats">
            <div class="stat">
              <span class="stat-label">Sold</span>
              <span class="stat-value">{{ product.count }}x</span>
            </div>
            <div class="stat">
              <span class="stat-label">Revenue</span>
              <span class="stat-value">{{ product.totalRevenue.toFixed(0) }} RON</span>
            </div>
          </div>
        </div>
        
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: getProgressWidth(product, index) + '%' }"
          ></div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data">
      <p>No products sold in this period</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

const orderStore = useOrderStore();
const currentRange = ref('week');

onMounted(() => {
  if (orderStore.orders.length === 0) {
    orderStore.startOrdersListener();
  }
});

const topProducts = computed(() => {
  return orderStore.getTopProducts(currentRange.value);
});



const getProgressWidth = (product, index) => {
  if (topProducts.value.length === 0) return 0;
  const maxCount = topProducts.value[0].count;
  return (product.count / maxCount) * 100;
};
</script>

<style scoped>
.top-products-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.filters {
  display: flex;
  gap: 0.5rem;
}

.filters button {
  padding: 8px 20px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 6px;
  transition: all 0.2s;
  white-space: nowrap;
}

.filters button:hover {
  border-color: #f39c12;
  color: #f39c12;
}

.filters button.active {
  background: #f39c12;
  color: white;
  border-color: #f39c12;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.product-card.rank-1 {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
}

.product-card.rank-2 {
  border-color: #c0c0c0;
  background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
}

.product-card.rank-3 {
  border-color: #cd7f32;
  background: linear-gradient(135deg, #fff5eb 0%, #ffffff 100%);
}

.rank-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 60px;
}



.rank-number {
  font-size: 0.75rem;
  font-weight: 700;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #95a5a6;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
}





.no-data {
  padding: 3rem 1rem;
  text-align: center;
  color: #95a5a6;
  font-size: 1rem;
}

/* Mobile styles */
@media (max-width: 640px) {
  .top-products-container {
    padding: 1rem;
    border-radius: 8px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header h3 {
    font-size: 1.1rem;
  }
  
  .filters {
    width: 100%;
  }
  
  .filters button {
    flex: 1;
    padding: 10px 16px;
    font-size: 0.8rem;
  }
  
  .product-card {
    padding: 1rem;
    flex-wrap: wrap;
  }
  
  .rank-badge {
    min-width: 50px;
  }
  
  .medal {
    font-size: 1.5rem;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .product-stats {
    gap: 1rem;
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .stat-value {
    font-size: 0.9rem;
  }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {
  .top-products-container {
    padding: 1.25rem;
  }
  
  .header h3 {
    font-size: 1.2rem;
  }
  
  .product-name {
    font-size: 1.05rem;
  }
}
</style>