import { useState } from 'react'
import { setCurrency } from '../storage/currency'
import { addSession } from '../storage/sessions'
import { getTotalStudyMinutes } from '../game/unlocks'

// Directly sets coins and total study minutes instead of earning/logging
// them for real — for testing things like shop prices or the Crystal
// Hollows unlock without waiting. Study minutes aren't stored as a single
// number (they're summed from every session), so this adds one hidden
// adjustment session, dated so it never counts as "today" for quests and
// isn't tied to any subject, to make the total come out to the number typed.
function DevTotalsForm({ currency, sessions, onChanged }) {
  const [coins, setCoins] = useState(String(currency))
  const [minutes, setMinutes] = useState(String(getTotalStudyMinutes(sessions)))

  function handleSubmit(e) {
    e.preventDefault()
    setCurrency(Number(coins) || 0)

    const delta = (Number(minutes) || 0) - getTotalStudyMinutes(sessions)
    if (delta !== 0) {
      addSession({
        id: crypto.randomUUID(),
        subjectId: null,
        startTime: 0,
        endTime: 0,
        durationMinutes: delta,
      })
    }

    onChanged()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        step="any"
        placeholder="Coins"
        value={coins}
        onChange={(e) => setCoins(e.target.value)}
      />
      <input
        type="number"
        step="any"
        placeholder="Total study minutes"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
      />
      <button type="submit">Set values</button>
    </form>
  )
}

export default DevTotalsForm
