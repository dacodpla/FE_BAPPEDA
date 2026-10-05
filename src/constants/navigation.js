import {
  LayoutGrid,
  FileText,
  CheckCircle,
  ClipboardList,
  Settings,
  BarChart3,
  Home,
  Plane,
} from 'lucide-vue-next'
import { ROLES } from './roles'

// Single source for sidebar + bottom nav. Filtered per user role at render time.
export const NAV_ITEMS = [
  {
    key: 'dashboard',
    to: '/dashboard',
    labelKey: 'nav.dashboard',
    icon: LayoutGrid,
    mobileIcon: Home,
    roles: [ROLES.EMPLOYEE, ROLES.APPROVER, ROLES.ADMIN],
    mobile: true,
  },
  {
    key: 'requests',
    to: '/requests',
    labelKey: 'nav.requests',
    icon: FileText,
    mobileIcon: Plane,
    roles: [ROLES.EMPLOYEE, ROLES.APPROVER, ROLES.ADMIN],
    mobile: true,
  },
  {
    key: 'approvals',
    to: '/approvals',
    labelKey: 'nav.approvals',
    icon: CheckCircle,
    roles: [ROLES.APPROVER, ROLES.ADMIN],
    mobile: false,
  },
  {
    key: 'reports',
    to: '/reports',
    labelKey: 'nav.reports',
    icon: ClipboardList,
    roles: [ROLES.EMPLOYEE, ROLES.APPROVER, ROLES.ADMIN],
    mobile: true,
  },
  {
    key: 'adminAnalytics',
    to: '/admin/analytics',
    labelKey: 'nav.adminAnalytics',
    icon: BarChart3,
    roles: [ROLES.ADMIN],
    mobile: false,
  },
  {
    key: 'settings',
    to: '/settings',
    labelKey: 'nav.settings',
    icon: Settings,
    roles: [ROLES.EMPLOYEE, ROLES.APPROVER, ROLES.ADMIN],
    mobile: true,
  },
]

export function itemsFor(role, { mobileOnly = false } = {}) {
  return NAV_ITEMS.filter(
    (item) => item.roles.includes(role) && (!mobileOnly || item.mobile),
  )
}
