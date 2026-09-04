const userKey = 'signbridge-user'
const accountsKey = 'signbridge-accounts'
const legacyAccountKey = 'signbridge-account'

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(userKey) || 'null') } catch { return null }
}

export function setCurrentUser(user) {
  localStorage.setItem(userKey, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(userKey)
}

export function getUserInitials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U'
}

export function getStoredAccounts() {
  const accounts = []
  try {
    const list = JSON.parse(localStorage.getItem(accountsKey) || '[]')
    if (Array.isArray(list)) accounts.push(...list)
  } catch {}

  try {
    const single = JSON.parse(localStorage.getItem(legacyAccountKey) || 'null')
    if (single?.email && !accounts.some((a) => a.email.toLowerCase() === single.email.toLowerCase())) {
      accounts.push(single)
    }
  } catch {}

  return accounts
}

export function findAccountByEmail(email = '') {
  const cleanEmail = email.trim().toLowerCase()
  return getStoredAccounts().find((a) => a.email?.trim().toLowerCase() === cleanEmail) || null
}

export function saveAccount({ name, email, password }) {
  const cleanEmail = email.trim().toLowerCase()
  const accounts = getStoredAccounts().filter((a) => a.email?.trim().toLowerCase() !== cleanEmail)
  const newAccount = { name: name.trim(), email: cleanEmail, password }
  accounts.push(newAccount)
  localStorage.setItem(accountsKey, JSON.stringify(accounts))
  localStorage.setItem(legacyAccountKey, JSON.stringify(newAccount))
  return newAccount
}

