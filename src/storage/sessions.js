const SESSIONS_KEY = 'overbloom:sessions'

export function getSessions() {
  const raw = localStorage.getItem(SESSIONS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function addSession(session) {
  const sessions = getSessions()
  const updated = [...sessions, session]
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated))
  return updated
}
