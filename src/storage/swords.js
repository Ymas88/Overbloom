const SWORDS_KEY = 'overbloom:swords'

// Map of swordId -> how many of that sword the player owns.
export function getSwords() {
  const raw = localStorage.getItem(SWORDS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function addSword(swordId) {
  const swords = getSwords()
  const updated = { ...swords, [swordId]: (swords[swordId] ?? 0) + 1 }
  localStorage.setItem(SWORDS_KEY, JSON.stringify(updated))
  return updated
}
