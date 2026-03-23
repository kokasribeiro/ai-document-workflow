import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import DocumentsPage from '../pages/DocumentsPage.vue'
import NewDocumentPage from '../pages/NewDocumentPage.vue'
import DocumentDetailPage from '../pages/DocumentDetailPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/documents', name: 'documents', component: DocumentsPage },
    { path: '/documents/new', name: 'new-document', component: NewDocumentPage },
    { path: '/documents/:id', name: 'document-detail', component: DocumentDetailPage },
  ],
})

export default router
