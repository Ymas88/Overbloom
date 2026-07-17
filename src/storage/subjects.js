const SUBJECTS_KEY = 'overbloom:subjects'

export function getSubjects() {
  const raw = localStorage.getItem(SUBJECTS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function addSubject(name) {
  const subjects = getSubjects()
  const updated = [...subjects, { id: crypto.randomUUID(), name }]
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(updated))
  return updated
}
