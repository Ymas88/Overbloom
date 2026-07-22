const QUESTS_KEY = 'overbloom:questsClaimed'

function todayKey(now = Date.now()) {
  return new Date(now).toDateString()
}

// Claimed quest ids reset automatically once the stored date no longer
// matches today, rather than needing an explicit daily-reset step.
export function getClaimedQuests() {
  const raw = localStorage.getItem(QUESTS_KEY)
  if (!raw) return []
  const data = JSON.parse(raw)
  return data.date === todayKey() ? data.claimed : []
}

export function claimQuest(questId) {
  const claimed = getClaimedQuests()
  const updated = [...claimed, questId]
  localStorage.setItem(QUESTS_KEY, JSON.stringify({ date: todayKey(), claimed: updated }))
  return updated
}
