const ACTIVE_SESSION_KEY = 'overbloom:activeSession'

export function getActiveSession() {
  const raw = localStorage.getItem(ACTIVE_SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setActiveSession(session) {
  localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session))
}

export function clearActiveSession() {
  localStorage.removeItem(ACTIVE_SESSION_KEY)
}
