const DAY_MS = 24 * 60 * 60 * 1000

const STAGE_THRESHOLDS = [
  { stage: 4, minMinutes: 600 },
  { stage: 3, minMinutes: 300 },
  { stage: 2, minMinutes: 120 },
  { stage: 1, minMinutes: 30 },
]

function minutesSince(sessions, now, days) {
  const cutoff = now - days * DAY_MS
  return sessions
    .filter((session) => session.endTime >= cutoff)
    .reduce((total, session) => total + session.durationMinutes, 0)
}

export function getGrowthStage(sessions, now = Date.now()) {
  const minutesLast7Days = minutesSince(sessions, now, 7)
  const matchedThreshold = STAGE_THRESHOLDS.find(
    (threshold) => minutesLast7Days >= threshold.minMinutes
  )
  const stage = matchedThreshold ? matchedThreshold.stage : 0

  const minutesLast3Days = minutesSince(sessions, now, 3)
  const isWilting = sessions.length > 0 && minutesLast3Days === 0

  return { stage, isWilting }
}
