const SWORDBOXES_KEY = 'overbloom:swordboxes'

export function getSwordBoxCount() {
  const raw = localStorage.getItem(SWORDBOXES_KEY)
  return raw ? Number(raw) : 0
}

export function addSwordBox() {
  const updated = getSwordBoxCount() + 1
  localStorage.setItem(SWORDBOXES_KEY, String(updated))
  return updated
}

export function removeSwordBox() {
  const updated = Math.max(0, getSwordBoxCount() - 1)
  localStorage.setItem(SWORDBOXES_KEY, String(updated))
  return updated
}
