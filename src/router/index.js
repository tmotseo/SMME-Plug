import { createRouter, createWebHistory } from 'vue-router'

import AdminPage from '../pages/AdminPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import FaqPage from '../pages/FaqPage.vue'
import HomePage from '../pages/HomePage.vue'
import JobseekersPage from '../pages/JobseekersPage.vue'
import OpportunitiesPage from '../pages/OpportunitiesPage.vue'
import PricingPage from '../pages/PricingPage.vue'
import ProfessionalsPage from '../pages/ProfessionalsPage.vue'
import SmmesPage from '../pages/SmmesPage.vue'
import { useRegistrationStore } from '../stores/registrationStore'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/smmes', name: 'smmes', component: SmmesPage },
  { path: '/professionals', name: 'professionals', component: ProfessionalsPage },
  { path: '/jobseekers', name: 'jobseekers', component: JobseekersPage },
  { path: '/opportunities', name: 'opportunities', component: OpportunitiesPage },
  { path: '/pricing', name: 'pricing', component: PricingPage },
  { path: '/faq', name: 'faq', component: FaqPage },
  { path: '/contact', name: 'contact', component: ContactPage },
  { path: '/admin', name: 'admin', component: AdminPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guards to refresh data on page navigation
router.beforeEach((to, _from, next) => {
  const store = useRegistrationStore()
  
  // Skip for admin page (has its own auth)
  if (to.name === 'admin') {
    next()
    return
  }

  // Load users data for pages that display registrations
  const pagesNeedingUsers = ['smmes', 'professionals', 'jobseekers']
  if (pagesNeedingUsers.includes(to.name)) {
    store.loadUsers()
  }

  // Load opportunities for opportunities page
  if (to.name === 'opportunities') {
    store.loadOpportunities()
  }

  next()
})

export default router
