export const ROLES = Object.freeze({
  EMPLOYEE: 'employee',
  APPROVER: 'approver',
  ADMIN: 'admin',
})

export const ALL_ROLES = Object.freeze(Object.values(ROLES))

export function hasRole(user, ...allowed) {
  if (!user) return false
  return allowed.length === 0 || allowed.includes(user.role)
}
