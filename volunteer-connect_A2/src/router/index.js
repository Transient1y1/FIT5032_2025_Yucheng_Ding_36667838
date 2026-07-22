import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import OpportunitiesView from '../views/OpportunitiesView.vue'
import OpportunityDetailView from '../views/OpportunityDetailView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'
import RegisterView from '../views/RegisterView.vue'
import UnauthorizedView from '../views/UnauthorizedView.vue'
import VolunteerDashboardView from '../views/VolunteerDashboardView.vue'
import CoordinatorDashboardView from '../views/CoordinatorDashboardView.vue'
import { getCurrentUser, getDashboardPath } from '../services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/opportunities',
      name: 'opportunities',
      component: OpportunitiesView,
    },
    {
      path: '/opportunities/:id',
      name: 'opportunity-detail',
      component: OpportunityDetailView,
    },
    {
      path: '/how-it-works',
      name: 'how-it-works',
      component: PlaceholderView,
      meta: {
        eyebrow: 'How it works',
        title: 'A clearer path into volunteering',
        description: 'The platform will connect discovery, preparation and follow-up in one place.',
      },
    },
    {
      path: '/for-organisations',
      name: 'for-organisations',
      component: PlaceholderView,
      meta: {
        eyebrow: 'For organisations',
        title: 'A lighter way to coordinate volunteers',
        description: 'Community organisations will have a structured space for roles and applicants.',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/volunteer/dashboard',
      name: 'volunteer-dashboard',
      component: VolunteerDashboardView,
      meta: { requiresAuth: true, role: 'volunteer' },
    },
    {
      path: '/coordinator/dashboard',
      name: 'coordinator-dashboard',
      component: CoordinatorDashboardView,
      meta: { requiresAuth: true, role: 'coordinator' },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: PlaceholderView,
      meta: {
        eyebrow: '404',
        title: 'Page not found',
        description: 'The page you requested does not exist.',
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const user = getCurrentUser()

  if (to.meta.guestOnly && user) {
    return getDashboardPath(user)
  }

  if (to.meta.requiresAuth && !user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return { name: 'unauthorized' }
  }

  return true
})

export default router
