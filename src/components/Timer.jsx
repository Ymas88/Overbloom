import { useEffect, useState } from 'react'
import { getActiveSession, setActiveSession, clearActiveSession } from '../storage/activeSession'
import { addSession } from '../storage/sessions'
import { getElapsedMs, msToMinutes, formatElapsed } from '../game/timer'
import { playSound } from '../playSound'

// status: 'idle' (never started) | 'running' (segmentStart is ticking) |
// 'paused' (frozen, not yet saved). accumulatedMs banks time from any
// segments before the current one, so pausing/resuming never loses
// progress the way stopping used to.
function Timer({ subjectId, onSessionSaved }) {
  const [status, setStatus] = useState('idle')
  const [segmentStart, setSegmentStart] = useState(null)
  const [accumulatedMs, setAccumulatedMs] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  // On mount, resume an unfinished session left over from before a refresh
  // — but only if it belongs to this plot's subject.
  useEffect(() => {
    const active = getActiveSession()
    if (!active || active.subjectId !== subjectId) return

    setAccumulatedMs(active.accumulatedMs)
    if (active.segmentStart) {
      setSegmentStart(active.segmentStart)
      setStatus('running')
      setElapsedMs(active.accumulatedMs + getElapsedMs(active.segmentStart))
    } else {
      setStatus('paused')
      setElapsedMs(active.accumulatedMs)
    }
  }, [subjectId])

  // While running, recompute elapsed time from the banked total plus the
  // current segment's start timestamp every second. The interval only
  // drives the display, never the source of truth.
  useEffect(() => {
    if (status !== 'running') return

    const intervalId = setInterval(() => {
      setElapsedMs(accumulatedMs + getElapsedMs(segmentStart))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [status, segmentStart, accumulatedMs])

  function handleStart() {
    const now = Date.now()
    setStatus('running')
    setSegmentStart(now)
    setAccumulatedMs(0)
    setElapsedMs(0)
    setActiveSession({ subjectId, segmentStart: now, accumulatedMs: 0 })
    playSound('/sounds/start.mp3')
  }

  function handlePause() {
    const banked = accumulatedMs + getElapsedMs(segmentStart)
    setAccumulatedMs(banked)
    setElapsedMs(banked)
    setSegmentStart(null)
    setStatus('paused')
    setActiveSession({ subjectId, segmentStart: null, accumulatedMs: banked })
    playSound('/sounds/stop.mp3')
  }

  function handleResume() {
    const now = Date.now()
    setSegmentStart(now)
    setStatus('running')
    setActiveSession({ subjectId, segmentStart: now, accumulatedMs })
    playSound('/sounds/start.mp3')
  }

  function handleStop() {
    const now = Date.now()
    const totalMs = status === 'running' ? accumulatedMs + getElapsedMs(segmentStart, now) : accumulatedMs
    addSession({
      id: crypto.randomUUID(),
      subjectId,
      startTime: now - totalMs,
      endTime: now,
      durationMinutes: msToMinutes(totalMs),
    })
    clearActiveSession()
    setStatus('idle')
    setSegmentStart(null)
    setAccumulatedMs(0)
    setElapsedMs(0)
    onSessionSaved()
    playSound('/sounds/stop.mp3')
  }

  return (
    <div>
      <p className="timer-display">{formatElapsed(elapsedMs)}</p>

      {status === 'idle' && <button onClick={handleStart}>Start</button>}
      {status === 'running' && (
        <div className="timer-actions">
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleStop}>Stop</button>
        </div>
      )}
      {status === 'paused' && (
        <div className="timer-actions">
          <button onClick={handleResume}>Resume</button>
          <button onClick={handleStop}>Stop</button>
        </div>
      )}
    </div>
  )
}

export default Timer
