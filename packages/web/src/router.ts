import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Auth from '@/views/Auth.vue';
import store from '@/store'
import { authenticate } from '@/auth/authenticate'
import { fetchMe } from '@/graphql/queries/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: Auth
  },
  {
    path: '/project',
    meta: { requiresAuth: true },
    component: () => import('@/views/Project.vue'),
    children: [
      {
        path: '',
        name: 'board',
        meta: { requiresAuth: true },
        component: () => import('@/views/Board.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        meta: { requiresAuth: true },
        component: () => import('@/views/Settings.vue')
      },
      {
        path: 'issue/:issueId',
        name: 'issue',
        meta: { requiresAuth: true },
        component: () => import('@/views/FullIIssueDetails.vue'),
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
console.log("router =============>", router)
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(routeRecord => routeRecord.meta.requiresAuth);
  if (requiresAuth) {
    if (!store.getters.isAuthenticated() && to.name !== 'root') {
      console.log("user is not authenticated and redirect to root")
      next({ name: 'root' })
    } else {
      console.log("user is authenticated and going to fetch user by token")
      try {
        const currentUser = await fetchMe();
        store.mutations.setCurrentUser(currentUser);
        next();
      } catch (error) {
        if (
          //@ts-ignore
          error?.message ===
          'GraphQL error: Authentication token is invalid: User not found.' ||
          //@ts-ignore
          error?.message === 'GraphQL error: Authentication token is invalid.'
        ) {
          await authenticate()
          next({ name: to.name || 'root' })
        }
      }
    }
  } else {
    console.log("<============Authentication is not required for this route===============>")
    next()
  }
})

export default router
