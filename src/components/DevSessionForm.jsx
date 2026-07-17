import { useState } from 'react'
import { addSession } from '../storage/sessions'

function DevSessionForm({ subjects, onSessionAdded }) {
  const [subjectId, setSubjectId] = useState('')
  const [minutes, setMinutes] = useState('')
  const [daysAgo, setDaysAgo] = useState('0')

  function handleSubmit(e) {
    e.preventDefault()
    const durationMinutes = Number(minutes)
    if (!subjectId || !durationMinutes) return

    const endTime = Date.now() - Number(daysAgo || 0) * 24 * 60 * 60 * 1000
    const startTime = endTime - durationMinutes * 60000

    addSession({
      id: crypto.randomUUID(),
      subjectId,
      startTime,
      endTime,
      durationMinutes,
    })

    setMinutes('')
    onSessionAdded()
  }

  return (
    <form onSubmit={handleSubmit}>
      <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
        <option value="">Select a subject</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        step="any"
        placeholder="Minutes"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
      />
      <input
        type="number"
        min="0"
        step="any"
        placeholder="Days ago"
        value={daysAgo}
        onChange={(e) => setDaysAgo(e.target.value)}
      />
      <button type="submit">Add test session</button>
    </form>
  )
}

export default DevSessionForm
