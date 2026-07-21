const DAY_MS = 24 * 60 * 60 * 1000

const STAGE_THRESHOLDS = [
  { stage: 4, minMinutes: 600 },
  { stage: 3, minMinutes: 300 },
  { stage: 2, minMinutes: 120 },
  { stage: 1, minMinutes: 30 },
]

// Flat currency reward for harvesting a fully-grown (stage 4) plot. Crop
// rarity/variety isn't designed yet, so every harvest pays the same for now.
export const HARVEST_REWARD = 10

function minutesSince(sessions, now, days) {
  const cutoff = now - days * DAY_MS
  return sessions
    .filter((session) => session.endTime >= cutoff)
    .reduce((total, session) => total + session.durationMinutes, 0)
}

// harvestedAt excludes any session that finished before the plot's last
// harvest, so a harvested plot needs fresh study time to regrow instead of
// re-counting minutes that already paid out.
export function getGrowthStage(sessions, now = Date.now(), harvestedAt = 0) {
  const eligible = sessions.filter((session) => session.endTime > harvestedAt)

  const minutesLast7Days = minutesSince(eligible, now, 7)
  const matchedThreshold = STAGE_THRESHOLDS.find(
    (threshold) => minutesLast7Days >= threshold.minMinutes
  )
  const stage = matchedThreshold ? matchedThreshold.stage : 0

  const minutesLast3Days = minutesSince(eligible, now, 3)
  const isWilting = eligible.length > 0 && minutesLast3Days === 0

  return { stage, isWilting }
}
