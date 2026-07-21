const SUBJECT_CROPS_KEY = 'overbloom:subjectCrops'

// Map of subjectId -> cropId, which crop that subject's plot grows.
export function getSubjectCrops() {
  const raw = localStorage.getItem(SUBJECT_CROPS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function setSubjectCrop(subjectId, cropId) {
  const assignments = getSubjectCrops()
  const updated = { ...assignments, [subjectId]: cropId }
  localStorage.setItem(SUBJECT_CROPS_KEY, JSON.stringify(updated))
  return updated
}
