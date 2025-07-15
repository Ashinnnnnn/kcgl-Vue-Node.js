import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/views/layout/AppLayout.vue'
import NotFound from '@/views/NotFound.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginView.vue'),
    },
    {
      path: '/',
      component: AppLayout,
      meta: { title: '首页', requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: '仪表盘', requiresAuth: true },
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/users/UsersIndex.vue'),
          meta: { title: '用户列表', requiresAuth: true },
        },
        {
          path: '/users/create',
          name: 'users-create',
          component: () => import('@/views/users/CreateOrEdit.vue'),
          meta: { title: '新建用户', requiresAuth: true },
        },
        {
          path: '/users/edit/:id',
          name: 'users-edit',
          component: () => import('@/views/users/CreateOrEdit.vue'),
          meta: { title: '编辑用户', requiresAuth: true },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: NotFound,
          meta: { title: '页面未找到', requiresAuth: true },
        },
        {
          path: '/courses',
          name: 'courses',
          component: () => import('@/views/courses/CoursesIndex.vue'),
          meta: { title: '课程列表', requiresAuth: true },
        },
        {
          path: '/courses/create',
          name: 'courses-create',
          component: () => import('@/views/courses/CreateOrEdit.vue'),
          meta: { title: '新建课程', requiresAuth: true },
        },
        {
          path: '/courses/edit/:id',
          name: 'courses-edit',
          component: () => import('@/views/courses/CreateOrEdit.vue'),
          meta: { title: '编辑课程', requiresAuth: true },
        },
        {
          path: '/categories',
          name: 'categories',
          component: () => import('@/views/categorys/CategorysIndex.vue'),
          meta: { title: '分类列表', requiresAuth: true },
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  //如果需要登录验证，但是却没登录，则跳转到登录页面
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  //如果已经登录，但是还要访问登录页面，则跳转到首页
  if (to.name === 'login' && authStore.isAuthenticated) {
    next('/')
    return
  }

  //如果不需要登录验证，则直接进入
  next()
})

export default router
