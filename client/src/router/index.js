import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/CheffView.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
    path: '/owner-view',
    name: 'OwnerView',
    component: () => import('../views/OwnerHomeView.vue'),
    meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
      path: '/staff-home',
      name: 'home',
      component: HomeView
    },
  ]

  
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login') }
   if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return next('/staff-home')
  } 
  
    next()
  
})

export default router