import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/firebase.js'; 
import { API_BASE_URL } from '../utils/constants';
import { useAuthStore } from './authStore';

export const useOrderStore = defineStore('order', () => {
  const orders = ref([]);
  const authStore = useAuthStore();
  let unsubscribeOrders = null;

  function startOrdersListener() {
      if (unsubscribeOrders) unsubscribeOrders();

    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );


    unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Orders:', orders.value);
    }, (error) => {
      console.error('Error fetching orders:', error.message);
    });
  }

  function stopOrdersListener() {
    if (unsubscribeOrders) {
      unsubscribeOrders();
      unsubscribeOrders = null;
    }
  }

 
  async function createOrder(tableNumber, notes) {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ tableNumber, notes })
    });
    return await response.json();
  }

  async function addProductToOrder(orderId, productId) {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/add-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ productId })
    });
    return await response.json();
  }

  
const activeOrders = computed(() => {
  const fourHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);

  return orders.value.filter(o => {

    if (['PENDING', 'COOKING', 'READY'].includes(o.status)) {
      return true;
    }

 
    if (o.status === 'DELIVERED') {
      const orderDate = new Date(o.createdAt);
      return orderDate >= fourHoursAgo;
    }

    return false;
  });
});


async function deleteOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${authStore.token}`
    }
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete order');
  }
}

    async function updateStatus(orderId, status) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || 'Failed to update status');
        }

        return data;
    } catch (error) {
        console.error('Update status error:', error);
        throw error;
    }
    }


  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'PENDING'));
  const cookingOrders = computed(() => orders.value.filter(o => o.status === 'COOKING'));
  const readyOrders = computed(() => orders.value.filter(o => o.status === 'READY'));
  const deliveredOrders = computed(() => orders.value.filter(o => o.status === 'DELIVERED'));

  const activeOrdersCount = computed(() => orders.value.filter(o => o.status !== 'DELIVERED').length);

  return { 
    orders, pendingOrders, cookingOrders, readyOrders, deliveredOrders, activeOrdersCount,
    createOrder, addProductToOrder, startOrdersListener, stopOrdersListener, activeOrders,updateStatus, deleteOrder
  };
});