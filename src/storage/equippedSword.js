const EQUIPPED_SWORD_KEY = 'overbloom:equippedSword'

// A single global equipped sword (not per-subject) — the player always
// carries it, so there's just one slot instead of an assignment map.
export function getEquippedSword() {
  return localStorage.getItem(EQUIPPED_SWORD_KEY)
}

export function setEquippedSword(swordId) {
  if (swordId) localStorage.setItem(EQUIPPED_SWORD_KEY, swordId)
  else localStorage.removeItem(EQUIPPED_SWORD_KEY)
  return swordId
}
