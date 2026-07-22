// Daily quests read directly off real session/harvest history instead of
// tracking their own progress — a quest is "done" the moment your actual
// study data satisfies it, so there's nothing to keep in sync.
export const QUEST_REWARD = 5

export const QUESTS = [
  { id: 'study-20', label: 'Study 20 minutes today', target: 20, metric: 'minutesToday' },
  { id: 'study-two-subjects', label: 'Study 2 different subjects today', target: 2, metric: 'subjectsToday' },
  { id: 'harvest-one', label: 'Harvest a plot today', target: 1, metric: 'harvestsToday' },
]

function isToday(timestamp, now) {
  return new Date(timestamp).toDateString() === new Date(now).toDateString()
}

export function getQuestProgress(sessions, harvests, now = Date.now()) {
  const todaysSessions = sessions.filter((s) => isToday(s.endTime, now))
  const minutesToday = todaysSessions.reduce((sum, s) => sum + s.durationMinutes, 0)
  const subjectsToday = new Set(todaysSessions.map((s) => s.subjectId)).size
  const harvestsToday = Object.values(harvests).filter((t) => isToday(t, now)).length

  return { minutesToday, subjectsToday, harvestsToday }
}

export function getQuestStatus(sessions, harvests, claimedIds, now = Date.now()) {
  const progress = getQuestProgress(sessions, harvests, now)
  return QUESTS.map((quest) => {
    const value = progress[quest.metric]
    return {
      ...quest,
      value,
      complete: value >= quest.target,
      claimed: claimedIds.includes(quest.id),
    }
  })
}
