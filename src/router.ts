import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './components/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/offers', component: () => import('./components/OffersPage.vue') },
  { path: '/recipe/:id', component: () => import('./components/RecipeDetailView.vue') },
  { path: '/profile', component: () => import('./components/ProfileView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router