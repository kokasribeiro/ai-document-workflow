<template>
  <form class="space-y-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-sm md:rounded-2xl md:p-6" @submit.prevent="handleSubmit">
    <div>
      <label class="mb-1 block text-sm font-medium">Title</label>
      <input v-model="title" class="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" type="text" />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Description</label>
      <textarea v-model="description" class="w-full rounded-lg border border-slate-200 px-3 py-2 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" rows="6" />
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Upload Document (PDF only)</label>
      <input
        type="file"
        accept=".pdf,application/pdf"
        class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-slate-700 hover:file:bg-slate-200"
        @change="handleFileUpload"
      />
      <p v-if="fileName" class="mt-1 text-xs text-slate-500">Uploaded: {{ fileName }}</p>
      <p v-if="fileError" class="mt-1 text-xs text-rose-600">{{ fileError }}</p>
    </div>

    <div>
      <label class="mb-1 block text-sm font-medium">Category</label>
      <CategorySelect v-model="category" />
    </div>

    <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
      <button type="submit" class="col-span-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500">
        Save Document
      </button>

      <button
        type="button"
        class="col-span-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 sm:col-span-1"
        @click="fillFakeDocument"
      >
        Create Fake Document
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="aiLoading"
        @click="handleAiSummary"
      >
        AI Summary
      </button>

      <button
        type="button"
        class="rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="aiLoading"
        @click="handleAiCategory"
      >
        Suggest Category
      </button>
    </div>

    <div v-if="aiLoading" class="flex items-center gap-2 text-sm text-slate-500">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
      <span>AI is processing...</span>
    </div>
    <p v-if="aiError" class="text-sm text-rose-600">{{ aiError }}</p>
    <p v-if="submitError" class="text-sm text-rose-600">{{ submitError }}</p>

    <div v-if="aiSummary" class="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
      <p class="text-xs font-semibold text-slate-500">AI Summary</p>
      <p class="mt-2 text-sm text-slate-700">{{ aiSummary }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DEFAULT_DOCUMENT_CATEGORY, DOCUMENT_CATEGORIES } from '../../constants/documents'
import { useDocumentStore } from '../../stores/documentStore'
import { summarizeDocument, suggestCategory } from '../../services/aiService'
import { extractPdfText } from '../../utils/pdfText'
import CategorySelect from './CategorySelect.vue'

const router = useRouter()
const store = useDocumentStore()

const title = ref('')
const description = ref('')
const category = ref<string>(DEFAULT_DOCUMENT_CATEGORY)
const aiSummary = ref('')
const aiLoading = ref(false)
const aiError = ref('')
const submitError = ref('')
const fileName = ref('')
const fileError = ref('')

const FAKE_DOCUMENTS: { title: string; description: string }[] = [
  { title: 'Invoice #78432 - Cloud Hosting Services', description: 'Monthly cloud infrastructure hosting for production and staging environments. Includes 4 dedicated servers, managed database cluster, CDN bandwidth (2.5TB), SSL certificates, and 24/7 monitoring. Billing period: March 1-31, 2026. Total amount: €4,320.00. Payment terms: Net 30.' },
  { title: 'Employee Onboarding Checklist - Q2 2026', description: 'Standard onboarding procedure for new hires joining in Q2 2026. Covers IT setup (laptop, email, VPN access), HR orientation (benefits enrollment, company policies), team introductions, mentor assignment, and 30/60/90 day performance milestones. Applies to 8 incoming employees across Engineering and Marketing.' },
  { title: 'Q1 2026 Revenue Report', description: 'Quarterly revenue analysis for January through March 2026. Total revenue: €1.2M (+18% YoY). SaaS subscriptions account for 72% of revenue, professional services 20%, and training workshops 8%. Customer churn decreased to 3.1%. Top-performing regions: EMEA (45%), North America (38%), APAC (17%). Three enterprise deals closed above €50K.' },
  { title: 'Software License Agreement - DataVault Pro', description: 'Enterprise software license agreement between our company and DataVault Technologies Inc. Covers 150 user seats for DataVault Pro analytics platform. License period: 12 months starting April 2026. Annual fee: €28,500. Includes premium support, quarterly updates, and data migration assistance. Auto-renewal clause with 60-day cancellation notice.' },
  { title: 'Office Lease Renewal Contract', description: 'Renewal of commercial office lease at Rua Augusta 47, 3rd Floor, Lisbon. Lease term: 36 months (May 2026 - April 2029). Monthly rent: €6,200 including building maintenance. Tenant improvement allowance: €15,000. Includes 12 parking spaces and access to rooftop terrace. Break clause available at month 18 with 3-month notice.' },
  { title: 'Annual Security Audit Report', description: 'Comprehensive security assessment conducted by CyberShield Partners. Scope: network infrastructure, web applications, API endpoints, and employee security practices. Key findings: 2 critical vulnerabilities patched, 5 medium-risk issues addressed, overall security posture rated B+ (improved from B). Penetration testing passed. SOC 2 Type II compliance confirmed.' },
  { title: 'Marketing Campaign Budget - Summer 2026', description: 'Proposed budget allocation for the summer 2026 marketing campaign "Innovation Days". Total budget: €85,000. Breakdown: Digital advertising (€35,000), event sponsorships (€20,000), content production (€15,000), influencer partnerships (€10,000), print materials (€5,000). Expected ROI: 3.2x based on Q3 2025 benchmark campaign.' },
  { title: 'Invoice #78501 - Legal Consulting', description: 'Professional legal services rendered for GDPR compliance review and contract template updates. 42 billable hours at €180/hour. Services include: privacy policy revision, data processing agreements for 3 new vendors, employee data handling procedures, and cookie consent implementation review. Total: €7,560.00. Payment due: April 30, 2026.' },
  { title: 'Remote Work Policy Update 2026', description: 'Updated company-wide remote work policy effective May 1, 2026. Key changes: hybrid model (3 office days minimum for local employees), home office stipend increased to €75/month, quarterly in-person team events mandatory, core collaboration hours set to 10:00-16:00 CET. Applies to all full-time employees. Equipment return policy for departing remote workers included.' },
  { title: 'Vendor Performance Evaluation - Q1 2026', description: 'Quarterly assessment of top 10 vendors by spend. Highlights: CloudStack (hosting) rated Excellent - 99.97% uptime. OfficeSupply.eu rated Satisfactory - 2 late deliveries. CleanPro (facilities) rated Good - consistent quality. Recommendation: renegotiate CloudStack contract for volume discount, issue formal warning to OfficeSupply.eu, renew CleanPro for 12 months.' },
]

function fillFakeDocument() {
  const fake = FAKE_DOCUMENTS[Math.floor(Math.random() * FAKE_DOCUMENTS.length)]!
  const randomCategory = DOCUMENT_CATEGORIES[Math.floor(Math.random() * DOCUMENT_CATEGORIES.length)]
  title.value = fake.title
  description.value = fake.description
  category.value = randomCategory ?? DEFAULT_DOCUMENT_CATEGORY
  aiSummary.value = ''
}

async function runAiOp<T>(
  operation: () => Promise<T>,
  onSuccess: (value: T) => void,
  fallbackMessage: string,
): Promise<void> {
  aiLoading.value = true
  aiError.value = ''
  try {
    onSuccess(await operation())
  } catch (error) {
    aiError.value = error instanceof Error ? error.message : fallbackMessage
  } finally {
    aiLoading.value = false
  }
}

async function handleAiSummary(): Promise<void> {
  await runAiOp(
    () => summarizeDocument(description.value),
    (summary) => {
      aiSummary.value = summary
    },
    'Failed to generate summary',
  )
}

async function handleAiCategory(): Promise<void> {
  await runAiOp(
    () => suggestCategory(description.value),
    (suggested) => {
      category.value = suggested
    },
    'Failed to suggest category',
  )
}

async function handleSubmit(): Promise<void> {
  submitError.value = ''
  try {
    await store.addDocument({
      title: title.value,
      description: description.value,
      category: category.value,
      status: 'Draft',
      aiSummary: aiSummary.value,
      aiSuggestedCategory: category.value,
    })
    await router.push('/documents')
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Failed to save document'
  }
}

async function handleFileUpload(event: Event): Promise<void> {
  fileError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    if (file.type && file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed')
    }
    const text = (await extractPdfText(file)).trim()
    if (!text) {
      throw new Error('Could not extract text from PDF')
    }
    description.value = text
    fileName.value = file.name
    if (!title.value.trim()) {
      title.value = file.name.replace(/\.[^.]+$/, '')
    }
  } catch (error) {
    fileError.value = error instanceof Error ? error.message : 'Could not process file'
  } finally {
    input.value = ''
  }
}
</script>
