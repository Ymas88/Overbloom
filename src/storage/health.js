const HEALTH_KEY = 'overbloom:health'

export const MAX_HEALTH = 50

export function getHealth() {
  const raw = localStorage.getItem(HEALTH_KEY)
  return raw ? Number(raw) : MAX_HEALTH
}

export function setHealth(value) {
  const clamped = Math.max(0, Math.min(MAX_HEALTH, value))
  localStorage.setItem(HEALTH_KEY, String(clamped))
  return clamped
}
