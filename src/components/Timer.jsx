import { useEffect, useState } from 'react'
import { getActiveSession, setActiveSession, clearActiveSession } from '../storage/activeSession'
import { addSession } from '../storage/sessions'
import { getElapsedMs, msToMinutes, formatElapsed } from '../game/timer'
import { playSound } from '../playSound'

function Timer({ subjectId, onSessionSaved }) {
  const [startTime, setStartTime] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)

  // On mount, resume an unfinished session left over from before a refresh
  // — but only if it belongs to this plot's subject.
  useEffect(() => {
    const active = getActiveSession()
    if (active && active.subjectId === subjectId) {
      setStartTime(active.startTime)
      setElapsedMs(getElapsedMs(active.startTime))
    }
  }, [subjectId])

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
    const now = Date.now()
    setStartTime(now)
    setElapsedMs(0)
    setActiveSession({ subjectId, startTime: now })
    playSound('/sounds/start.mp3')
  }

  function handleStop() {
    const endTime = Date.now()
    addSession({
      id: crypto.randomUUID(),
      subjectId,
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
      <p className="timer-display">{formatElapsed(elapsedMs)}</p>

      {running ? (
        <button onClick={handleStop}>Stop</button>
      ) : (
        <button onClick={handleStart}>Start</button>
      )}
    </div>
  )
}

export default Timer
