// Minimum total study minutes (across every subject, all-time) needed to
// unlock the Crystal Hollows. A single constant so the threshold is easy
// to retune later without hunting through the portal/collision code.
export const CAVE_UNLOCK_MINUTES = 10

export function getTotalStudyMinutes(sessions) {
  return sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
}

export function isCaveUnlocked(sessions) {
  return getTotalStudyMinutes(sessions) >= CAVE_UNLOCK_MINUTES
}
