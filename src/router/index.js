import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLES, ALL_ROLES } from '@/constants/roles'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { layout: 'auth', public: true, titleKey: 'pageTitle.login' },
  },
  { path: '/', redirect: '/dashboard' },

  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.dashboard' },
  },
  {
    path: '/requests',
    name: 'requests',
    component: () => import('@/views/RequestListView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.requests' },
  },
  {
    path: '/requests/new',
    name: 'requests-new',
    component: () => import('@/views/NewRequestView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.newRequest' },
  },
  {
    path: '/requests/:id/edit',
    name: 'requests-edit',
    component: () => import('@/views/NewRequestView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.editRequest' },
  },
  {
    path: '/approvals',
    name: 'approvals',
    component: () => import('@/views/ApprovalCenterView.vue'),
    meta: { roles: [ROLES.APPROVER, ROLES.ADMIN], titleKey: 'pageTitle.approvals' },
  },
  {
    path: '/reports',
    name: 'reports-index',
    component: () => import('@/views/ReportListView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.reports' },
  },
  {
    path: '/reports/:requestId',
    name: 'reports-detail',
    component: () => import('@/views/ReportView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.reports' },
  },
  {
    path: '/admin/analytics',
    name: 'admin-analytics',
    component: () => import('@/views/admin/AnalyticsView.vue'),
    meta: { roles: [ROLES.ADMIN], titleKey: 'pageTitle.adminAnalytics' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.settings' },
  },

  // Development-only: base-component catalog. Kept behind a route so it never
  // appears in navigation. Any authenticated user may open it.
  {
    path: '/dev/components',
    name: 'dev-components',
    component: () => import('@/views/dev/ComponentsView.vue'),
    meta: { roles: ALL_ROLES, titleKey: 'pageTitle.components' },
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Ensure the session is loaded exactly once per app instance.
  if (!auth.isReady) {
    await auth.fetchMe()
  }

  if (to.meta.public) {
    // Signed-in users bounce away from the login page.
    if (to.name === 'login' && auth.isAuthenticated) {
      return { path: '/dashboard' }
    }
    return true
  }

  if (!auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  const allowed = to.meta.roles || ALL_ROLES
  if (!allowed.includes(auth.role)) {
    return { path: '/dashboard' }
  }

  return true
})

export default router
