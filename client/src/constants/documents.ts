export const DOCUMENT_CATEGORIES = ['Invoice', 'Contract', 'Report', 'HR'] as const
export const DEFAULT_DOCUMENT_CATEGORY = DOCUMENT_CATEGORIES[0]

export const DOCUMENT_STATUSES = ['Draft', 'Review', 'Approved', 'Rejected'] as const

/** Dashboard / list: status label + card accent */
export const DOCUMENT_STATUS_META: ReadonlyArray<{
  status: (typeof DOCUMENT_STATUSES)[number]
  label: string
  icon: string
  cardClass: string
}> = [
  { status: 'Draft', label: 'Draft', icon: '📝', cardClass: 'border-slate-200/70' },
  { status: 'Review', label: 'Review', icon: '🕵️', cardClass: 'border-amber-200/70' },
  { status: 'Approved', label: 'Approved', icon: '✅', cardClass: 'border-emerald-200/70' },
  { status: 'Rejected', label: 'Rejected', icon: '⛔', cardClass: 'border-rose-200/70' },
]
