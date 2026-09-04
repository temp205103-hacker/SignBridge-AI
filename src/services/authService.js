const userKey = 'signbridge-user'

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(userKey) || 'null') } catch { return null }
}

export function getUserInitials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U'
}
