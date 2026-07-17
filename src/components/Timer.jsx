import { useEffect, useState } from 'react'
import { getActiveSession, setActiveSession, clearActiveSession } from '../storage/activeSession'
import { addSession } from '../storage/sessions'
import { getElapsedMs, msToMinutes, formatElapsed } from '../game/timer'
import { playSound } from '../playSound'

function Timer({ subjects, onSessionSaved }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)

  // On mount, resume an unfinished session left over from before a refresh.
  useEffect(() => {
    const active = getActiveSession()
    if (active) {
      setSelectedSubjectId(active.subjectId)
      setStartTime(active.startTime)
      setElapsedMs(getElapsedMs(active.startTime))
    }
  }, [])

  // While running, recompute elapsed time from the stored start timestamp
  // every second. The interval only drives the display, never the source
  // of truth.
  useEffect(() => {
    if (startTime === null) return

    const intervalId = setInterval(() => {
      setElapsedMs(getElapsedMs(startTime))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [startTime])

  function handleStart() {
    if (!selectedSubjectId) return
    const now = Date.now()
    setStartTime(now)
    setElapsedMs(0)
    setActiveSession({ subjectId: selectedSubjectId, startTime: now })
    playSound('/sounds/start.mp3')
  }

  function handleStop() {
    const endTime = Date.now()
    addSession({
      id: crypto.randomUUID(),
      subjectId: selectedSubjectId,
      startTime,
      endTime,
      durationMinutes: msToMinutes(endTime - startTime),
    })
    clearActiveSession()
    setStartTime(null)
    setElapsedMs(0)
    onSessionSaved()
    playSound('/sounds/stop.mp3')
  }

  const running = startTime !== null

  return (
    <div>
      <select
        value={selectedSubjectId}
        onChange={(e) => setSelectedSubjectId(e.target.value)}
        disabled={running}
      >
        <option value="">Select a subject</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>

      <p>{formatElapsed(elapsedMs)}</p>

      {running ? (
        <button onClick={handleStop}>Stop</button>
      ) : (
        <button onClick={handleStart} disabled={!selectedSubjectId}>
          Start
        </button>
      )}
    </div>
  )
}

export default Timer
