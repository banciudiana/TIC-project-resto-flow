import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, 
})


router.beforeEach((to, from, next) => {
  console.log(`router Navigation to: ${to.path}`)
  next()
})

export default router