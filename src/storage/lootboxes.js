const LOOTBOXES_KEY = 'overbloom:lootboxes'

export function getLootBoxCount() {
  const raw = localStorage.getItem(LOOTBOXES_KEY)
  return raw ? Number(raw) : 0
}

export function addLootBox() {
  const updated = getLootBoxCount() + 1
  localStorage.setItem(LOOTBOXES_KEY, String(updated))
  return updated
}

export function removeLootBox() {
  const updated = Math.max(0, getLootBoxCount() - 1)
  localStorage.setItem(LOOTBOXES_KEY, String(updated))
  return updated
}
