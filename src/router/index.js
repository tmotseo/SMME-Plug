import { createRouter, createWebHistory } from 'vue-router'

import AdminPage from '../pages/AdminPage.vue'
import HomePage from '../pages/HomePage.vue'
import JobseekersPage from '../pages/JobseekersPage.vue'
import ProfessionalsPage from '../pages/ProfessionalsPage.vue'
import SmmesPage from '../pages/SmmesPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/smmes', name: 'smmes', component: SmmesPage },
  { path: '/professionals', name: 'professionals', component: ProfessionalsPage },
  { path: '/jobseekers', name: 'jobseekers', component: JobseekersPage },
  { path: '/admin', name: 'admin', component: AdminPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
