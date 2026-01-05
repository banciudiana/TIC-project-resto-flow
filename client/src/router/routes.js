
const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('@/layouts/default.vue'), 
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/Login.vue')
      }
    ]
  },

];

export default routes;