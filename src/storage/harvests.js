const HARVESTS_KEY = 'overbloom:harvests'

// Map of subjectId -> timestamp the plot was last harvested at.
export function getHarvests() {
  const raw = localStorage.getItem(HARVESTS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function setHarvestedAt(subjectId, timestamp) {
  const harvests = getHarvests()
  const updated = { ...harvests, [subjectId]: timestamp }
  localStorage.setItem(HARVESTS_KEY, JSON.stringify(updated))
  return updated
}
