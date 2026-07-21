const SEEDS_KEY = 'overbloom:seeds'

// Map of cropId -> how many of that seed the player owns (from loot boxes).
export function getSeeds() {
  const raw = localStorage.getItem(SEEDS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function addSeed(cropId) {
  const seeds = getSeeds()
  const updated = { ...seeds, [cropId]: (seeds[cropId] ?? 0) + 1 }
  localStorage.setItem(SEEDS_KEY, JSON.stringify(updated))
  return updated
}
