import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'

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
      component: PlaceholderView,
      meta: {
        eyebrow: 'Opportunities',
        title: 'Opportunity directory',
        description: 'A focused place for student-friendly community roles will live here.',
      },
    },
    {
      path: '/opportunities/:id',
      name: 'opportunity-detail',
      component: PlaceholderView,
      meta: {
        eyebrow: 'Opportunity',
        title: 'Opportunity details',
        description: 'Practical role information will be presented here before an expression of interest.',
      },
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
      component: PlaceholderView,
      meta: {
        eyebrow: 'Account access',
        title: 'Welcome back',
        description: 'Account sign-in will be added in the authentication milestone.',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: PlaceholderView,
      meta: {
        eyebrow: 'Account access',
        title: 'Create a volunteer account',
        description: 'Registration will be added alongside role-based access controls.',
      },
    },
    {
      path: '/volunteer/dashboard',
      name: 'volunteer-dashboard',
      component: PlaceholderView,
      meta: {
        eyebrow: 'Volunteer account',
        title: 'Your volunteering dashboard',
        description: 'Saved roles and application updates will be gathered here.',
      },
    },
    {
      path: '/coordinator/dashboard',
      name: 'coordinator-dashboard',
      component: PlaceholderView,
      meta: {
        eyebrow: 'Coordinator account',
        title: 'Coordinator workspace',
        description: 'Organisations will be able to review applicants and manage role outcomes here.',
      },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: PlaceholderView,
      meta: {
        eyebrow: 'Access',
        title: 'This page is not available for this account',
        description: 'Return to the public opportunity area to continue exploring VolunteerConnect.',
      },
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

export default router
