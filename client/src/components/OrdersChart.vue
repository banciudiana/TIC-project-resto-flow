<template>
  <div class="chart-container">
    <div class="chart-header">
      <h3>Orders Evolution</h3>
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
    
    <apexchart 
      v-if="series[0].data.length > 0"
      type="bar" 
      :height="chartHeight" 
      :options="chartOptions" 
      :series="series" 
    />
    <div v-else class="no-data">
      <p>No orders data available for this period</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import VueApexCharts from "vue3-apexcharts";

const apexchart = VueApexCharts;
const orderStore = useOrderStore();
const currentRange = ref('week');
const windowWidth = ref(window.innerWidth);

// Responsive chart height
const chartHeight = computed(() => {
  if (windowWidth.value < 640) return 250;
  if (windowWidth.value < 1024) return 300;
  return 350;
});

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  if (orderStore.orders.length === 0) {
    orderStore.startOrdersListener();
  }
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});

const chartOptions = computed(() => ({
  chart: { 
    id: 'orders-chart', 
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: windowWidth.value < 640 ? '60%' : '50%',
      distributed: false
    }
  },
  dataLabels: {
    enabled: false
  },
  colors: ['#3498db'],
  xaxis: { 
    type: 'category',
    categories: categories.value,
    labels: {
      rotate: windowWidth.value < 640 ? -45 : 0,
      rotateAlways: windowWidth.value < 640,
      style: {
        fontSize: windowWidth.value < 640 ? '10px' : '12px',
        fontWeight: 500
      },
      trim: true,
      hideOverlappingLabels: true
    }
  },
  yaxis: { 
    labels: { 
      formatter: (val) => {
        if (windowWidth.value < 640) {
          return val ? `${val.toFixed(0)}` : '0';
        }
        return val ? `${val.toFixed(0)} orders` : '0 orders';
      },
      style: {
        fontSize: windowWidth.value < 640 ? '10px' : '12px'
      }
    },
    min: 0,
    forceNiceScale: true
  },
  tooltip: { 
    x: { 
      show: true
    },
    y: {
      formatter: (val) => `${val} orders`
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    padding: {
      left: windowWidth.value < 640 ? 5 : 10,
      right: windowWidth.value < 640 ? 5 : 10
    }
  },
  legend: {
    show: windowWidth.value >= 640
  }
}));

const categories = computed(() => {
  if (currentRange.value === 'week') {
    const now = new Date();
    const dayNames = windowWidth.value < 640 
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(dayNames[date.getDay()]);
    }
    return labels;
  } else {
    const monthNames = windowWidth.value < 640
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const labels = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthNames[date.getMonth()]);
    }
    return labels;
  }
});

const series = computed(() => {
  const filtered = orderStore.getOrdersByRange(currentRange.value);
  
 

  if (!filtered || filtered.length === 0) {
    return [{ name: 'Orders', data: [] }];
  }

  if (currentRange.value === 'week') {

    const dataMap = {};
    
    filtered.forEach(order => {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const day = orderDate.toISOString().split('T')[0];
        
        dataMap[day] = (dataMap[day] || 0) + 1; 
      }
    });

    const now = new Date();
    const allDays = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      allDays.push(dataMap[dayStr] || 0);
    }


    
    return [{
      name: 'Orders',
      data: allDays
    }];
    
  } else {

    const dataMap = {};
    
    filtered.forEach(order => {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        
        dataMap[monthKey] = (dataMap[monthKey] || 0) + 1; 
      }
    });

   

    const now = new Date();
    const allMonths = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      allMonths.push(dataMap[monthKey] || 0);
    }

 
    return [{
      name: 'Orders',
      data: allMonths
    }];
  }
});
</script>

<style scoped>
.chart-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  width: 100%;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.chart-header h3 {
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
  border-color: #3498db;
  color: #3498db;
}

.filters button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.no-data {
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95a5a6;
  font-size: 1rem;
  text-align: center;
  padding: 1rem;
}


@media (max-width: 640px) {
  .chart-container {
    padding: 1rem;
    border-radius: 8px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-header h3 {
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
  
  .no-data {
    height: 250px;
    font-size: 0.9rem;
  }
}

/* Tablet styles */
@media (min-width: 641px) and (max-width: 1024px) {
  .chart-container {
    padding: 1.25rem;
  }
  
  .chart-header h3 {
    font-size: 1.2rem;
  }
  
  .no-data {
    height: 300px;
  }
}

/* Large screens */
@media (min-width: 1025px) {
  .chart-container {
    padding: 1.5rem;
  }
}
</style>