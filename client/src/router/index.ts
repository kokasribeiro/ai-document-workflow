import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import DocumentsPage from '../pages/DocumentsPage.vue'
import NewDocumentPage from '../pages/NewDocumentPage.vue'
import DocumentDetailPage from '../pages/DocumentDetailPage.vue'
import AuthPage from '../pages/AuthPage.vue'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/auth', name: 'auth', component: AuthPage },
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/documents', name: 'documents', component: DocumentsPage },
    { path: '/documents/new', name: 'new-document', component: NewDocumentPage },
    { path: '/documents/:id', name: 'document-detail', component: DocumentDetailPage },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.name !== 'auth' && !auth.isAuthenticated) return { name: 'auth' }
  if (to.name === 'auth' && auth.isAuthenticated) return { name: 'dashboard' }
  return true
})

export default router
