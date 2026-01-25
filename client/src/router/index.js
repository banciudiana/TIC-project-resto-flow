import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
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
      path: '/register-staff',
      name: 'RegisterStaff',
      component: () => import('../views/RegisterEmployeeView.vue'),
      meta: { requiresAuth: true, role: 'ROLE_OWNER' }
    },
    {
    path: '/manage-staff',
    name: 'ManageStaff',  component: () => import('../views/ManageStaffView.vue'),
    meta: { 
      requiresAuth: true, 
      role: 'ROLE_OWNER' 
    }},
    {
    path: '/manage-menu',
    name: 'ManageMenu',
    component: () => import('@/views/ManageMenuView.vue'),
    meta: { 
      requiresAuth: true, 
      role: 'ROLE_OWNER' 
    }
    },
    {
      path: '/waiter',
      name: 'waiter-dashboard',
      component: () => import('../views/WaiterView.vue'),
      meta: { requiresAuth: true, role: 'ROLE_WAITER' }
    },
    {
      path: '/chef',
      name: 'chef-dashboard',
      component: () => import('../views/ChefView.vue'),
      meta: { requiresAuth: true, role: 'ROLE_CHEF' }
    },
          
   
  ]

  
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.user?.role


  if (to.path === '/' && isAuthenticated) {
    if (userRole === 'ROLE_WAITER') return next('/waiter')
    if (userRole === 'ROLE_CHEF') return next('/chef')
    if (userRole === 'ROLE_OWNER') return next('/owner-view')
  }


  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/')
  }

  if (to.meta.role && isAuthenticated && userRole !== to.meta.role) {
    console.warn("Acces denied for :", userRole)
 
    if (userRole === 'ROLE_WAITER') return next('/waiter')
    if (userRole === 'ROLE_CHEF') return next('/chef')
    return next('/')
  }

  next()
})
export default router