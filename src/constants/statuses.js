// Mirrors backend/src/constants/statuses.js exactly. Never render a raw enum
// to the user — always resolve through STATUS_META + vue-i18n.

export const TRAVEL_REQUEST_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  REVISION: 'REVISION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
})

export const REIMBURSEMENT_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REVISION: 'REVISION',
})

export const MASTER_DATA_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
})

/** Visual tone for status badges. Each tone is styled once in StatusBadge.vue. */
export const STATUS_META = Object.freeze({
  DRAFT: { labelKey: 'status.draft', tone: 'neutral' },
  PENDING: { labelKey: 'status.pending', tone: 'warning' },
  REVISION: { labelKey: 'status.revision', tone: 'danger-soft' },
  APPROVED: { labelKey: 'status.approved', tone: 'success' },
  REJECTED: { labelKey: 'status.rejected', tone: 'danger' },
  COMPLETED: { labelKey: 'status.completed', tone: 'info' },
  ACTIVE: { labelKey: 'status.active', tone: 'success' },
  INACTIVE: { labelKey: 'status.inactive', tone: 'neutral' },
})

export function statusMeta(status) {
  return STATUS_META[status] || { labelKey: 'status.unknown', tone: 'neutral' }
}
